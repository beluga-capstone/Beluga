import textwrap

from beluga.common import run
from beluga.core.schema.workspace import WorkspaceSchema


class UI:
    __slots__ = ("_workspace")

    _workspace: WorkspaceSchema

    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace

    def deploy(self):
        ui = self._workspace.services.ui
        cmd = textwrap.dedent(
            f"""
            PORT={api.port} make -C ui/ run -e
            """
        )

    def stop(self):
        cmd = textwrap.dedent(
            f"""
            make -C ui/ stop
            """
        )
        run.context.run_cmd(cmd, shell=True)
