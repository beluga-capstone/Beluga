import re
import textwrap
from pathlib import Path

from magic.common import run
from magic.core.schema.workspace import Machine, Settings, WorkspaceSchema


class VirtualBox:
    __slots__ = ("_workspace", "_settings", "_portmap", "_iso_path")

    _workspace: WorkspaceSchema
    _settings: Settings
    _portmap: Path
    _iso_path: Path

    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace
        self._settings = workspace.virtual_machines.settings
        self._portmap = workspace.meta.deploy_data.joinpath("portmaps")
        self._iso_path = workspace.meta.deploy_data.joinpath("iso")

    def network(self):
        """
        Configure hostonly network.
        """
        # setup virtual network interface
        res, _ = run.context.run_cmd(
            "VBoxManage list hostonlyifs",
            become=self._settings.become,
            poll_stdout=False,
        )

        # quick and dirty check if hostonlyif is available
        assert self._settings.vnetif in re.compile(
            "^Name:[ ]+(vboxnet[0-9]+)", re.MULTILINE
        ).findall(res.decode())

        # initalize interface with defined network configuration
        run.context.run_cmd(
            textwrap.dedent(
                f"""
                VBoxManage hostonlyif ipconfig {self._settings.vnetif}
                    --ip {self._settings.ipv4_range.network_address + 1}
                    --netmask {self._settings.ipv4_range.netmask}
                """
            ),
            self._settings.become,
        )

    def provision(self, vm: Machine):
        """
        Provision virtual machine.
        """
        run.context.run_cmd(
            f"mkdir -p {self._settings.install_path}", become=self._settings.become
        )
        vm_path = self._settings.install_path.joinpath(vm.name)
        disk_path = vm_path.joinpath(vm.name).with_suffix(".vmdk")
        iso_path = self._iso_path.joinpath(vm.name).with_suffix(".iso")

        # provision
        cmds = [
            # create vm
            textwrap.dedent(
                f"""
                VBoxManage createvm
                    --name {vm.name}
                    --ostype "Fedora_64"
                    --register
                    --basefolder {vm_path}
                """
            ),
            f"VBoxManage modifyvm {vm.name} --ioapic on",
            # configure cpu, memory
            f"VBoxManage modifyvm {vm.name} --cpus {vm.cores}",
            textwrap.dedent(
                f"""
                VBoxManage modifyvm {vm.name}
                    --memory {vm.memory} --vram 16
                """
            ),
            # specify network configuration
            f"VBoxManage modifyvm {vm.name} --nic1 hostonly",
            textwrap.dedent(
                f"""
                VBoxManage modifyvm {vm.name}
                    --hostonlyadapter1 {self._settings.vnetif}
                """
            ),
            # configure gpu (recommended setting)
            f"VBoxManage modifyvm {vm.name} --graphicscontroller vmsvga",
            # create disk and attach iso
            textwrap.dedent(
                f"""
                VBoxManage createhd --filename {disk_path}
                    --size {vm.disk_size} --format VMDK
                """
            ),
            textwrap.dedent(
                f"""
                VBoxManage storagectl {vm.name}
                    --name "SATA Controller"
                    --add sata --controller IntelAHCI
            """
            ),
            textwrap.dedent(
                f"""
                VBoxManage storageattach {vm.name}
                    --storagectl "SATA Controller"
                    --port 0 --device 0 --type hdd
                    --medium {disk_path}
                """
            ),
            textwrap.dedent(
                f"""
                VBoxManage storagectl {vm.name} --name "IDE Controller"
                    --add ide --controller PIIX4
                """
            ),
            textwrap.dedent(
                f"""
                VBoxManage storageattach {vm.name}
                    --storagectl "IDE Controller"
                    --port 1 --device 0 --type dvddrive
                    --medium {iso_path}
                """
            ),
            # set boot priority
            textwrap.dedent(
                f"""
                VBoxManage modifyvm {vm.name}
                    --boot1 disk --boot2 dvd --boot3 none --boot4 none
                """
            ),
            # disable unnecessary settings
            f"VBoxManage modifyvm {vm.name} --audio none",
            # for more recent versions use the following as above is deprecated
            # f"VBoxManage modifyvm {vm.name} --audio-drive none",
            f"VBoxManage modifyvm {vm.name} --usbohci off",
            # enable / disable extended features as needed
            f"VBoxManage modifyvm {vm.name} --rtcuseutc on",
            f"VBoxManage modifyvm {vm.name} --nested-hw-virt on",
        ]

        for cmd in cmds:
            run.context.run_cmd(cmd, become=self._settings.become)
        self.start(vm.name)

    def destroy(self, vm_name: str):
        """
        Remove virtual machine and all files.
        """
        run.context.run_cmd(
            f"VBoxManage unregistervm {vm_name} --delete",
            become=self._settings.become,
        )

    def poweroff(self, vm_name: str):
        """
        Poweroff running vm.
        """
        run.context.run_cmd(
            f"VBoxManage controlvm {vm_name} poweroff",
            become=self._settings.become,
        )

    def start(self, vm_name: str):
        """
        Start vm.
        """
        run.context.run_cmd(
            f"VBoxManage startvm {vm_name} --type headless",
            become=self._settings.become,
        )
