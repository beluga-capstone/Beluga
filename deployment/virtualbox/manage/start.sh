#!/bin/bash

source ../vm_names.sh

VBoxManage startvm ${VM_BUILD}
VBoxManage startvm ${VM_REGISTRY}
VBoxManage startvm ${VM_CONTAINERS}