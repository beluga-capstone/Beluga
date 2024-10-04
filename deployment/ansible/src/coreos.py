import os
import textwrap
from pathlib import Path

from magic.common import run
from magic.common.template import MagicTemplate
from magic.common.utils import get_magic_root
from magic.core.schema.workspace import Machine, Settings, WorkspaceSchema


class CoreOS:
    __slots__ = (
        "_workspace",
        "_settings",
        "_iso_path",
        "_docker_prefix",
        "_ssh_identity",
    )

    _workspace: WorkspaceSchema
    _settings: Settings
    _iso_path: Path
    _docker_prefix: str
    _ssh_identity: str

    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace
        self._settings = workspace.virtual_machines.settings
        self._iso_path = workspace.meta.deploy_data.joinpath("iso")
        # use docker prefix to ensure portability
        self._docker_prefix = f"""
            docker run --security-opt label=disable
            --volume {Path.cwd()}:{Path.cwd()}
            --user {os.getuid()}:{os.getgid()}
            --workdir /pwd --rm ctf-fedora
        """
        self._ssh_identity = (
            Path()
            .home()
            .joinpath(".ssh")
            .joinpath(self._workspace.ctf_name)
            .with_suffix(".pub")
            .read_text()
        )

    def _build_fedora(self):
        fedora_dockerfile = (
            get_magic_root()
            .joinpath("templates")
            .joinpath("vm")
            .joinpath("ctf-fedora.dockerfile")
        )
        run.context.run_cmd(
            f"docker build -t ctf-fedora:latest -f {fedora_dockerfile} ."
        )

    def setup(self):
        # uses docker to ensure portability
        self._build_fedora()
        # prepare iso build path
        self._iso_path.mkdir(exist_ok=True, parents=True)
        run.context.run_cmd(
            textwrap.dedent(
                f"""
                {self._docker_prefix}
                "coreos-installer download
                -s stable -p metal -f iso -C {self._iso_path}"
            """
            )
        )

    def gen_iso(self, vm: Machine):
        base_iso = [i for i in self._iso_path.glob("*.iso")][0]
        butane_template = MagicTemplate(
            get_magic_root()
            .joinpath("templates")
            .joinpath("vm")
            .joinpath("fcos.yml")
            .read_text()
        )

        iso_path = self._iso_path.joinpath(vm.name).with_suffix(".iso")
        ign_path = iso_path.with_suffix(".ign")
        butane_path = self._iso_path.joinpath(vm.name).with_suffix(".bu")

        butane_path.write_text(
            butane_template.substitute(
                yescrypt=self._workspace.secrets.fcos,
                ssh_identity=self._ssh_identity,
                hostname=vm.name,
                interface="enp0s3",
                ip=vm.ip,
                prefix=self._settings.ipv4_range.prefixlen,
                gateway=self._settings.ipv4_range.network_address + 1,
                registry_ip=self._workspace.virtual_machines.container_registry.ip,
            )
        )

        run.context.run_cmd(
            textwrap.dedent(
                f"""
            {self._docker_prefix}
            "butane --strict --pretty {butane_path} -o {ign_path}"
            """
            )
        )

        run.context.run_cmd(
            textwrap.dedent(
                f"""
                {self._docker_prefix}
                "coreos-installer iso customize
                    --force
                    --dest-device /dev/sda
                    --dest-ignition {ign_path}
                    -o {iso_path} {base_iso}"
                """
            )
        )

        run.context.run_cmd(f"chmod go+r {iso_path}")
