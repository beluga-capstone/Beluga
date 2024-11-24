from enum import StrEnum

from beluga.core.cli import CliGroup, Beluga, beluga_cli
from beluga.plugins.docker import docker

cli_group = CliGroup(beluga_cli.subparsers, "docker")


class DeployType(StrEnum):
    registry = "registry"
    baseimg = "baseimg"


class Docker(Beluga):
    """
    Helper functions for administration of containers.
    """

    __slots__ = ("_docker")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._docker = docker.Docker(self._workspace)

    @cli_group.option(
        "--deploy-type", "-d", help="type of service to deploy", choices=DeployType
    )
    @cli_group.command()
    def deploy(self, deploy_type: DeployType):
        """
        Deploy images/containers
        """
        deploy_type = DeployType(deploy_type)
        self._docker.setup_context()

        match deploy_type:
            case DeployType.registry:
                self._docker.setup_registry()
            case DeployType.baseimg:
                self._docker.setup_base_image()
