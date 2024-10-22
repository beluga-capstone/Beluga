#!/bin/bash

# exit if any command fails
set -e

#############################
######### CONSTANTS #########
#############################
ISO_PATH="./iso/"
CONFIG_PATH="./config/"

source ./vm_names.sh

ISO_BUILD_PATH="${ISO_PATH}/${VM_BUILD}.iso"
ISO_REGISTRY_PATH="${ISO_PATH}/${VM_REGISTRY}.iso"
ISO_CONTAINERS_PATH="${ISO_PATH}/${VM_CONTAINERS}.iso"

CONFIG_BUILD_PATH="${CONFIG_PATH}/${VM_BUILD}.yml"
CONFIG_REGISTRY_PATH="${CONFIG_PATH}/${VM_REGISTRY}.yml"
CONFIG_CONTAINERS_PATH="${CONFIG_PATH}/${VM_CONTAINERS}.yml"

#############################
##### CREATE CUSTOM ISOS ####
#############################
if [ ! -f "${ISO_BUILD_PATH}" ]; then
    python3 generate_iso.py -v ${VM_BUILD} -i beluga-build -c ${CONFIG_BUILD_PATH}
else
    echo "ISO for build VM already exists at ${ISO_BUILD_PATH}"
fi

if [ ! -f "${ISO_REGISTRY_PATH}" ]; then
    python3 generate_iso.py -v ${VM_REGISTRY} -i beluga-registry -c ${CONFIG_REGISTRY_PATH}
else
    echo "ISO for registry VM already exists at ${ISO_REGISTRY_PATH}"
fi

if [ ! -f "${ISO_CONTAINERS_PATH}" ]; then
    python3 generate_iso.py -v ${VM_CONTAINERS} -i beluga-containers -c ${CONFIG_CONTAINERS_PATH}
else
    echo "ISO for containers VM already exists at ${ISO_CONTAINERS_PATH}"
fi

#############################
######### BUILD VMS #########
#############################
build_vm() {
    local VM_NAME=$1
    local ISO_PATH=$2
    
    echo "Starting build for ${VM_NAME}..."
    
    VBoxManage createvm --name ${VM_NAME} --ostype Fedora_64 --register
    VBoxManage modifyvm ${VM_NAME} --memory 2048 --cpus 2 --nic1 nat
    VBoxManage createhd --filename ~/VirtualBox\ VMs/${VM_NAME}/${VM_NAME}.vdi --size 6000
    VBoxManage storagectl ${VM_NAME} --name "SATA Controller" --add sata --controller IntelAhci
    VBoxManage storageattach ${VM_NAME} --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium ~/VirtualBox\ VMs/${VM_NAME}/${VM_NAME}.vdi
    VBoxManage storageattach ${VM_NAME} --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium ${ISO_PATH}
    
    # set boot order w/ hard disk first, then DVD
    VBoxManage modifyvm ${VM_NAME} --boot1 disk --boot2 dvd --boot3 none --boot4 none
    
    VBoxManage startvm ${VM_NAME} --type headless
    
    sleep 120
    
    VBoxManage controlvm ${VM_NAME} poweroff
    
    echo "Build completed for ${VM_NAME}."
}

deattach_iso() {
    local VM_NAME=$1
    VBoxManage storageattach ${VM_NAME} --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium none
}

build_vm ${VM_BUILD} ${ISO_BUILD_PATH} &
build_vm ${VM_REGISTRY} ${ISO_REGISTRY_PATH} &
build_vm ${VM_CONTAINERS} ${ISO_CONTAINERS_PATH} &
    wait

deattach_iso ${VM_BUILD} &
deattach_iso ${VM_REGISTRY} &
deattach_iso ${VM_CONTAINERS} &
wait

echo "All VMs have been set up and are ready to use."