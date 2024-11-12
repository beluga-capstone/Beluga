#!/bin/bash

source ../vm_names.sh

VBoxManage unregistervm ${VM_BUILD} --delete
VBoxManage unregistervm ${VM_REGISTRY} --delete
VBoxManage unregistervm ${VM_CONTAINERS} --delete