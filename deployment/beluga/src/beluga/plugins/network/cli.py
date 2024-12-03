from beluga.core.cli import CliGroup, Beluga, beluga_cli
from beluga.plugins.network import nginx
from beluga.plugins.network.ssh import SshConfigBuilder

cli_group = CliGroup(beluga_cli.subparsers, "nginx")


class Nginx(Beluga):
    """
    Helper functions for managing nginx deployment.
    """
    __slots__ = ("_nginx")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._nginx = nginx.Nginx(self._workspace)

    @cli_group.command()
    def build(self, **_):
        """
        Build nginx configs for all services
        """
        self._nginx.build()

    @cli_group.option("--force", "-f", help="force replace staged nginx configs.")
    @cli_group.command()
    def stage(self, force: bool = False, **_):
        """
        Make generated nginx configs available to nginx service.
        """
        self._nginx.stage(force)

    @cli_group.command()
    def enable(self, **_):
        """
        Enable nginx configs that are available to nginx service.
        """
        self._nginx.enable()

    @cli_group.command()
    def disable(self, **_):
        """
        Disable nginx configs that are available to nginx service.
        """
        self._nginx.disable()


cli_group.parser.description = Nginx.__doc__

cli_group = CliGroup(beluga_cli.subparsers, "ssh")


class Ssh(Beluga):
    """
    Manual SSH key generation
    """
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._ssh = SshConfigBuilder

    @cli_group.command()
    def genkeys(self, **_):
        """
        Generate SSH public private key pair
        """
        self._ssh = self._ssh(self._workspace)

        for vm in (
            self._workspace.virtual_machines.registry,
            self._workspace.virtual_machines.container
        ):
            self._ssh.update(vm)

        self._ssh.finalize()


cli_group.parser.description = Ssh.__doc__
