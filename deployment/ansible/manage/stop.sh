#!/bin/bash

source ../vm_names.sh

VBoxManage controlvm ${VM_BUILD} poweroff
VBoxManage controlvm ${VM_REGISTRY} poweroff
VBoxManage controlvm ${VM_CONTAINERS} poweroff

# acpipowerbutton instead?