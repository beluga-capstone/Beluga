from ipaddress import IPv4Address
from pathlib import Path
from re import escape

from beluga.common import run
from beluga.common.template import BelugaTemplate
from beluga.core.schema.config import ConfigSchema
from beluga.core.schema.workspace import WorkspaceSchema
from beluga.plugins.network.portmap import Portmap, Service
from beluga.common.utils import get_beluga_root, get_project_root


class DataPaths:
    __slots__ = "_root", "sites", "streams", "snippets"
    
    _root: Path
    sites: Path
    streams: Path
    snippets: Path

    def __init__(self, root: Path, suffix=""):
        self._root = root
        for k in self.__slots__[1:]:
            setattr(self, k, self._root.joinpath(f"{k}{suffix}"))

    def get_api_server(self) -> Path:
        return self.sites.joinpath("beluga-api.conf")

    def get_ui_server(self) -> Path:
        return self.sites.joinpath("beluga-ui.conf")

    def get_ssl_certs(self) -> Path:
        return self.snippets.joinpath("beluga-ssl-certs.conf")

    def get_map(self) -> Path:
        return self._root.joinpath("mappings.conf")

    def get_root(self) -> Path:
        return self._root


class NginxBuilder:
    __slots__ = (
        "_workspace",
        "_api_template",
        "_ui_template",
        "_map_template",
        "_service_map_template",
        "_ssl_certs_template"
    )

    _workspace: WorkspaceSchema
    _api_template: BelugaTemplate
    _ui_template: BelugaTemplate
    _map_template: BelugaTemplate
    _service_map_template: BelugaTemplate
    _ssl_certs_template: BelugaTemplate

    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace
        self._api_template = BelugaTemplate(
            get_beluga_root()
            .joinpath("templates")
            .joinpath("nginx")
            .joinpath("api")
            .read_text()
        )
        self._ui_template = BelugaTemplate(
            get_beluga_root()
            .joinpath("templates")
            .joinpath("nginx")
            .joinpath("ui")
            .read_text()
        )
        self._map_template = BelugaTemplate(
            get_beluga_root()
            .joinpath("templates")
            .joinpath("nginx")
            .joinpath("map")
            .read_text()
        )
        self._ssl_certs_template = BelugaTemplate(
            get_beluga_root()
            .joinpath("templates")
            .joinpath("nginx")
            .joinpath("certs")
            .read_text()
        )
        self._service_map_template = BelugaTemplate("\t#{sni} 127.0.0.1:#{port};\n")

    def generate_api_listener(self) -> str:
        config = ConfigSchema(get_project_root().joinpath("api"))

        return self._api_template.substitute(
            domain=".".join([config.settings.subdomain, self._workspace.nginx.domain]).lstrip("."),
            ssl_port=config.nginx.port,
            port=config.environ.port,
        )

    def generate_ui_listener(self) -> str:
        config = ConfigSchema(get_project_root().joinpath("ui"))
        return self._ui_template.substitute(
            domain=".".join([config.settings.subdomain, self._workspace.nginx.domain]).lstrip("."),
            ssl_port=config.nginx.port,
            port=config.environ.port,
        )

    def generate_map(self) -> str:
        mappings = ""

        apicfg = ConfigSchema(get_project_root().joinpath("api"))
        uicfg = ConfigSchema(get_project_root().joinpath("ui"))

        mappings += self._service_map_template.substitute(
            sni=".".join([apicfg.settings.subdomain, self._workspace.nginx.domain]).lstrip("."),
            port=apicfg.nginx.port,
        )

        mappings += self._service_map_template.substitute(
            sni=".".join([uicfg.settings.subdomain, self._workspace.nginx.domain]).lstrip("."),
            port=uicfg.nginx.port,
        )

        return self._map_template.substitute(services=mappings)

    def generate_ssl_certs(self) -> str:
        return self._ssl_certs_template.substitute(
            cert_path=self._workspace.nginx.cert_path.rstrip("/"),
        )


class Nginx:
    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace

        self._data_paths = DataPaths(
            root=self._workspace.meta.deploy_data.joinpath("nginx")
        )
        self._available_paths = DataPaths(
            root=Path("/etc")
            .joinpath("nginx")
            .joinpath("beluga")
        )
        self._enable_paths = DataPaths(
            root=Path("/etc").joinpath("nginx"), suffix="-enabled"
        )

        for nginx_type in DataPaths.__slots__[1:]:
            path = getattr(self._data_paths, nginx_type)
            path.mkdir(exist_ok=True, parents=True)

    def build(self):
        nginx_builder = NginxBuilder(self._workspace)

        self._data_paths.get_api_server().write_text(
            nginx_builder.generate_api_listener()
        )
        self._data_paths.get_ui_server().write_text(
            nginx_builder.generate_ui_listener()
        )
        self._data_paths.get_map().write_text(
            nginx_builder.generate_map()
        )
        self._data_paths.get_ssl_certs().write_text(
            nginx_builder.generate_ssl_certs()
        )

    def stage(self, force: bool = False):
        src = self._data_paths.get_root()
        dst = self._available_paths.get_root()

        if dst.is_dir() and not force:
            print(f'Destination directory "{src}" already exists...')
            res = input("Would you like to overwrite? (Y/n): ")

            if res.lower() == "n":
                return

        run.context.run_cmd(f"rm -rf {dst}", become=self._workspace.nginx.become)
        run.context.run_cmd(f"cp -rf {src} {dst}", become=self._workspace.nginx.become)

    def enable(self):
        if not Path("/etc/nginx/sites-enabled").is_dir():
            run.context.run_cmd(f"mkdir /etc/nginx/sites-enabled", become=self._workspace.nginx.become)

        if not Path("/etc/nginx/streams-enabled").is_dir():
            run.context.run_cmd(f"mkdir /etc/nginx/streams-enabled", become=self._workspace.nginx.become)

        for src in self._available_paths.sites.glob("*.conf"):
            dst = (
                self._enable_paths.get_root()
                .joinpath("sites-enabled")
            )

            run.context.run_cmd(
                f"ln -sf {src} {dst}", become=self._workspace.nginx.become
            )

        for src in self._available_paths.snippets.glob("*"):
            dst = (
                self._enable_paths.get_root()
                .joinpath("snippets")
                .joinpath(src.name)
            )

            run.context.run_cmd(
                f"ln -sf {src} {dst}", become=self._workspace.nginx.become
            )

        src = (
            self._available_paths.get_root().joinpath("mappings.conf")
        )

        dst = (
            self._enable_paths.get_root()
            .joinpath("streams-enabled")
            .joinpath("beluga-mappings.conf")
        )

        run.context.run_cmd(
            f"ln -sf {src} {dst}", become=self._workspace.nginx.become
        )

        print(
            f"WARNING: If nginx is already listening on 443, nginx reload will fail. Move the generated mappings to the file serving port 443, and enable proxy protocol on the server directive. Then remove the generated mappings from streams-enabled to get rid of the conflict."
        )

        run.context.run_cmd("systemctl reload nginx", become=self._workspace.nginx.become)

    def disable(self):
        for nginx_type in self._enable_paths.__slots__[1:-1]:
            target = getattr(self._enable_paths, nginx_type)
            run.context.run_cmd(
                f'find {target} -name "beluga*" -type l -exec unlink {{}} \\;',
                become=self._workspace.nginx.become,
            )

        # unlink snippets
        target = self._enable_paths.get_root().joinpath("snippets")
        run.context.run_cmd(
            f'find {target} -name "beluga*" -type l -exec unlink {{}} \\;',
            become=self._workspace.nginx.become,
        )
