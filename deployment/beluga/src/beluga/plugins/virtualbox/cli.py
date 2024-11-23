from typing import Iterable

from beluga.core.cli import CliGroup, Beluga, beluga_cli
from beluga.core.schema.workspace import Machine
from beluga.plugins.virtualbox import virtualbox

cli_group = CliGroup(beluga_cli.subparsers, "virtualbox")


class VirtualBox(Beluga):
    """
    By default, if no VMs are specified, the following subcommands will apply to all VMs defined in workspace.toml.
    The only exceptions are the network and status subcommands.
    """

    __slots__ = ("_vbox",)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._vbox = virtualbox.VirtualBox(self._workspace)

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

    @cli_group.command()
    def network(self, **_):
        """
        Configure virtual network interface.
        """
        self._vbox.network()

    @cli_group.option("--vm-names", "-v", help="virtual machines to provision")
    @cli_group.command()
    def provision(self, vm_names: list[str] = [], **_):
        """
        Provision specified virtual machine(s).
        """
        if not vm_names:
            stdin = input("Provisioning all defined virtual machines, proceed? (Y/N) ")
            if stdin.lower() == "n":
                exit(0)
        vms = self._filter_vms(vm_names)

        for vm in vms:
            self._vbox.provision(vm)

    @cli_group.option("--vm-names", "-v", help="virtual machines to destroy")
    @cli_group.command()
    def destroy(self, vm_names: list[str] = [], **_):
        """
        Destroy specified virtual machine(s).
        """
        if not vm_names:
            stdin = input("Destroying all defined virtual machines, proceed? (Y/N) ")
            if stdin.lower() == "n":
                exit(0)
        vms = self._filter_vms(vm_names)

        for vm in vms:
            self._vbox.destroy(vm.name)

    @cli_group.option("--vm-names", "-v", help="virtual machines to destroy")
    @cli_group.command()
    def poweroff(self, vm_names: list[str] = [], **_):
        """
        Poweroff specified virutal machine(s).
        """
        if not vm_names:
            stdin = input("Powering off all defined virtual machines, proceed? (Y/N) ")
            if stdin.lower() == "n":
                exit(0)
        vms = self._filter_vms(vm_names)

        for vm in vms:
            self._vbox.poweroff(vm.name)

    @cli_group.option("--vm-names", "-v", help="virtual machines to start")
    @cli_group.command()
    def start(self, vm_names: list[str] = [], **_):
        """
        Power on specified virtual machine(s).
        """
        if not vm_names:
            stdin = input("Powering on all defined virtual machines, proceed? (Y/N) ")
            if stdin.lower() == "n":
                exit(0)
        vms = self._filter_vms(vm_names)

        for vm in vms:
            self._vbox.start(vm.name)


cli_group.parser.description = VirtualBox.__doc__
