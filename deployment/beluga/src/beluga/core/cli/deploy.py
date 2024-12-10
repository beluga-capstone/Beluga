from beluga.core.cli.cli import CliGroup
from beluga.core.cli.beluga import Beluga, beluga_cli
from beluga.plugins.coreos.coreos import CoreOS

cli_group = CliGroup(beluga_cli.subparsers, "deploy")


class Deploy(Beluga):
    __slots__ = ("_isoprovider")

    _isoprovider: CoreOS

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._isoprovider = CoreOS
