import textwrap

from beluga.common import run
from beluga.core.schema.workspace import WorkspaceSchema


class DB:
    __slots__ = ("_workspace")

    _workspace: WorkspaceSchema

    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace

    def deploy(self):
        db = self._workspace.services.db
        cmd = textwrap.dedent(
            f"""
            docker run --name {db.name} -e POSTGRES_USER=beluga -e POSTGRES_PASSWORD={db.pwd} -e POSTGRES_DB={db.db} -p {db.port}:5432 -d postgres:alpine
            """
        )

        run.context.run_cmd(cmd)

    def stop(self):
        db = self._workspace.services.db
        cmd = textwrap.dedent(
            f"""
            docker container rm -rf {db.name}
            """
        )
        run.context.run_cmd(cmd, shell=True)
