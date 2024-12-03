import textwrap

from beluga.common import run
from beluga.core.schema.workspace import WorkspaceSchema


class API:
    __slots__ = ("_workspace")

    _workspace: WorkspaceSchema

    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace

    def deploy(self):
        api = self._workspace.services.api
        cmd = textwrap.dedent(
            f"""
            PORT={api.port} make -C api/ run -e
            """
        )

        run.context.run_cmd(cmd, shell=True)

    def stop(self):
        cmd = textwrap.dedent(
            f"""
            make -C api/ stop
            """
        )
        run.context.run_cmd(cmd, shell=True)
