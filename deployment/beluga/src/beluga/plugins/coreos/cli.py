from typing import Iterable

from beluga.core.cli import CliGroup, Beluga, beluga_cli
from beluga.core.schema.workspace import Machine
from beluga.plugins.coreos import coreos

cli_group = CliGroup(beluga_cli.subparsers, "coreos")


class CoreOS(Beluga):
    """
    Beluga VM ISO creation service.
    """

    __slots__ = ("_fcos",)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._fcos = coreos.CoreOS(self._workspace)
        self._fcos.setup()

    def _filter_vms(self, vm_names: list[str]) -> Iterable[Machine]:
        if vm_names:
            selected = [
                vm
                for vm in self._workspace.virtual_machines.all()
                if vm.name in vm_names
            ]
            if not selected:
                raise Exception(f"Selected VMs are not defined: {vm_names}")
        else:
            selected = self._workspace.virtual_machines.all()
        return selected

    @cli_group.option("--vm-names", "-v", help="virtual machines to provision")
    @cli_group.command()
    def isos(self, vm_names: list[str] = [], **_):
        """
        Generate specified virtual machine(s) isos.
        """
        stdin = input("Generating ISOs for all defined virtual machines, proceed? (Y/N) ")
        if not vm_names:
            if stdin.lower() == "n":
                exit(0)
        vms = self._filter_vms(vm_names)

        for vm in vms:
            self._fcos.gen_iso(vm)


cli_group.parser.description = CoreOS.__doc__
