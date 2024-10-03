#############################
######### Build VM ##########
#############################
VBoxManage createvm --name Fedora64_Build --ostype Fedora_64 --register
VBoxManage modifyvm Fedora64_Build --memory 2048 --cpus 2 --nic1 nat
VBoxManage createhd --filename ~/VirtualBox\ VMs/Fedora64_Build/Fedora64_Build.vdi --size 6000
VBoxManage storagectl Fedora64_Build --name "SATA Controller" --add sata --controller IntelAhci
VBoxManage storageattach Fedora64_Build --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium ~/VirtualBox\ VMs/Fedora64_Build/Fedora64_Build.vdi
VBoxManage storageattach Fedora64_Build --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium ~/machines/iso/Fedora-Workstation-Live-x86_64-40-1.14.iso

#############################
######## Registry VM ########
#############################
VBoxManage createvm --name Fedora64_Registry --ostype Fedora_64 --register
VBoxManage modifyvm Fedora64_Registry --memory 2048 --cpus 2 --nic1 nat
VBoxManage createhd --filename ~/VirtualBox\ VMs/Fedora64_Registry/Fedora64_Registry.vdi --size 6000
VBoxManage storagectl Fedora64_Registry --name "SATA Controller" --add sata --controller IntelAhci
VBoxManage storageattach Fedora64_Registry --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium ~/VirtualBox\ VMs/Fedora64_Registry/Fedora64_Registry.vdi
VBoxManage storageattach Fedora64_Registry --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium ~/machines/iso/Fedora-Workstation-Live-x86_64-40-1.14.iso

#############################
####### Containers VM #######
#############################
VBoxManage createvm --name Fedora64_Containers --ostype Fedora_64 --register 
VBoxManage modifyvm Fedora64_Containers --memory 2048 --cpus 2 --nic1 nat
VBoxManage createhd --filename ~/VirtualBox\ VMs/Fedora64_Containers/Fedora64_Containers.vdi --size 6000
VBoxManage storagectl Fedora64_Containers --name "SATA Controller" --add sata --controller IntelAhci
VBoxManage storageattach Fedora64_Containers --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium ~/VirtualBox\ VMs/Fedora64_Containers/Fedora64_Containers.vdi
VBoxManage storageattach Fedora64_Containers --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium ~/machines/iso/Fedora-Workstation-Live-x86_64-40-1.14.iso

#############################
######### Networking ########
#############################
VBoxManage hostonlyif create
VBoxManage modifyvm Fedora64_Build --nic1 hostonly --hostonlyadapter1 vboxnet0
VBoxManage modifyvm Fedora64_Registry --nic1 hostonly --hostonlyadapter1 vboxnet0
VBoxManage modifyvm Fedora64_Containers --nic1 hostonly --hostonlyadapter1 vboxnet0

