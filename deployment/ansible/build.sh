#!/bin/bash

# exit if any command fails
set -e

#############################
######### CONSTANTS #########
#############################
ISO_PATH="./iso/"

VM_BUILD="Beluga_Build"
VM_REGISTRY="Beluga_Registry"
VM_CONTAINERS="Beluga_Containers"

ISO_BUILD_PATH="${ISO_PATH}/${VM_BUILD}.iso"
ISO_REGISTRY_PATH="${ISO_PATH}/${VM_REGISTRY}.iso"
ISO_CONTAINERS_PATH="${ISO_PATH}/${VM_CONTAINERS}.iso"

CONFIG_BUILD_PATH="beluga-build-vm.yml"
CONFIG_REGISTRY_PATH="beluga-registry-vm.yml"
CONFIG_CONTAINERS_PATH="beluga-containers-vm.yml"

#############################
##### CREATE CUSTOM ISOS ####
#############################
if [ ! -f "${ISO_BUILD_PATH}" ]; then
    echo "Generating ISO for Build VM..."
    python3 generate_iso.py -v ${VM_BUILD} -i beluga-build -c ${CONFIG_BUILD_PATH}
else
    echo "ISO for build VM already exists at ${ISO_BUILD_PATH}"
fi

if [ ! -f "${ISO_REGISTRY_PATH}" ]; then
    echo "Generating ISO for Registry VM..."
    python3 generate_iso.py -v ${VM_REGISTRY} -i beluga-registry -c ${CONFIG_REGISTRY_PATH}
else
    echo "ISO for registry VM already exists at ${ISO_REGISTRY_PATH}"
fi

if [ ! -f "${ISO_CONTAINERS_PATH}" ]; then
    echo "Generating ISO for Containers VM..."
    python3 generate_iso.py -v ${VM_CONTAINERS} -i beluga-containers -c ${CONFIG_CONTAINERS_PATH}
else
    echo "ISO for containers VM already exists at ${ISO_CONTAINERS_PATH}"
fi

#############################
######### Build VM ##########
#############################
VBoxManage createvm --name ${VM_BUILD} --ostype Fedora_64 --register
VBoxManage modifyvm ${VM_BUILD} --memory 2048 --cpus 2 --nic1 nat
VBoxManage createhd --filename ~/VirtualBox\ VMs/${VM_BUILD}/${VM_BUILD}.vdi --size 6000
VBoxManage storagectl ${VM_BUILD} --name "SATA Controller" --add sata --controller IntelAhci
VBoxManage storageattach ${VM_BUILD} --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium ~/VirtualBox\ VMs/${VM_BUILD}/${VM_BUILD}.vdi
VBoxManage storageattach ${VM_BUILD} --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium ${ISO_BUILD_PATH}

#############################
######## Registry VM ########
#############################
VBoxManage createvm --name ${VM_REGISTRY} --ostype Fedora_64 --register
VBoxManage modifyvm ${VM_REGISTRY} --memory 2048 --cpus 2 --nic1 nat
VBoxManage createhd --filename ~/VirtualBox\ VMs/${VM_REGISTRY}/${VM_REGISTRY}.vdi --size 6000
VBoxManage storagectl ${VM_REGISTRY} --name "SATA Controller" --add sata --controller IntelAhci
VBoxManage storageattach ${VM_REGISTRY} --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium ~/VirtualBox\ VMs/${VM_REGISTRY}/${VM_REGISTRY}.vdi
VBoxManage storageattach ${VM_REGISTRY} --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium ${ISO_REGISTRY_PATH}

#############################
####### Containers VM #######
#############################
VBoxManage createvm --name ${VM_CONTAINERS} --ostype Fedora_64 --register 
VBoxManage modifyvm ${VM_CONTAINERS} --memory 2048 --cpus 2 --nic1 nat
VBoxManage createhd --filename ~/VirtualBox\ VMs/${VM_CONTAINERS}/${VM_CONTAINERS}.vdi --size 6000
VBoxManage storagectl ${VM_CONTAINERS} --name "SATA Controller" --add sata --controller IntelAhci
VBoxManage storageattach ${VM_CONTAINERS} --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium ~/VirtualBox\ VMs/${VM_CONTAINERS}/${VM_CONTAINERS}.vdi
VBoxManage storageattach ${VM_CONTAINERS} --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium ${ISO_CONTAINERS_PATH}

#############################
######### Networking ########
#############################
# VBoxManage hostonlyif create
# VBoxManage modifyvm ${VM_BUILD} --nic1 hostonly --hostonlyadapter1 vboxnet0
# VBoxManage modifyvm ${VM_REGISTRY} --nic1 hostonly --hostonlyadapter1 vboxnet0
# VBoxManage modifyvm ${VM_CONTAINERS} --nic1 hostonly --hostonlyadapter1 vboxnet0

