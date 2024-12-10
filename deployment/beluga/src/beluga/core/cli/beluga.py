import argparse
from abc import ABC
from pathlib import Path

from beluga.common.utils import get_project_root
from beluga.core.cli.cli import Cli
from beluga.core.schema.workspace import WorkspaceSchema

beluga_cli = Cli(
    prog="Beluga",
    description="""
    A CLI tool used for deploying Beluga services
    """,
    formatter_class=argparse.ArgumentDefaultsHelpFormatter,
)


class Beluga(ABC):
    @beluga_cli.option(
        "--workspace", "-w", help="project directory where workspace.toml is located"
    )
    def __init__(self, workspace: Path = get_project_root(), **_):
        self._workspace = WorkspaceSchema(workspace)
