from pathlib import Path

from beluga.common import run
from beluga.common.template import BelugaTemplate
from beluga.common.utils import get_beluga_root
from beluga.core.schema.workspace import Machine, WorkspaceSchema


class SshConfigBuilder:
    __slots__ = (
        "_workspace",
        "_config_template",
        "_identity_file",
        "_ssh_path",
        "_config",
    )

    _workspace: WorkspaceSchema
    _config_template: BelugaTemplate
    _identity_file: Path
    _ssh_path: Path
    _config: list[str]

    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace
        self._config_template = BelugaTemplate(
            get_beluga_root()
            .joinpath("templates")
            .joinpath("vm")
            .joinpath("ssh_config")
            .read_text()
        )
        self._identity_file = (
            Path.home().joinpath(".ssh").joinpath("beluga")
        )
        self._ssh_path = self._workspace.meta.deploy_data.joinpath("ssh")
        self._config = []

        self._ssh_path.mkdir(parents=True, exist_ok=True)
        if not self._identity_file.is_file():
            run.context.run_cmd(
                f"ssh-keygen -t ed25519 -N '' -C 'beluga' -f {self._identity_file}"
            )

    def update(self, vm: Machine):
        self._config.append(
            self._config_template.substitute(
                vm=vm.name,
                ip=vm.ip,
                identity_file=self._identity_file,
            )
        )

    def finalize(self):
        self._ssh_path.joinpath("config").write_text("\n".join(self._config))
