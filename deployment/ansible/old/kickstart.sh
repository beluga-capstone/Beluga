VBoxManage controlvm Fedora64_Build keyboardputscancode 01 81
VBoxManage controlvm Fedora64_Build keyboardputstring linux inst.ks=hd:nvme0n1p1:/home/undone/Documents/tamu/capstone/Beluga/deployment/ansible/anaconda-ks.cfg
VBoxManage controlvm Fedora64_Build keyboardputscancode 1c 9c

VBoxManage controlvm Fedora64_Registry keyboardputscancode 01 81
VBoxManage controlvm Fedora64_Registry keyboardputstring linux inst.ks=hd:nvme0n1p1:/home/undone/Documents/tamu/capstone/Beluga/deployment/ansible/anaconda-ks.cfg
VBoxManage controlvm Fedora64_Registry keyboardputscancode 1c 9c

VBoxManage controlvm Fedora64_Containers keyboardputscancode 01 81
VBoxManage controlvm Fedora64_Containers keyboardputstring linux inst.ks=hd:nvme0n1p1:/home/undone/Documents/tamu/capstone/Beluga/deployment/ansible/anaconda-ks.cfg
VBoxManage controlvm Fedora64_Containers keyboardputscancode 1c 9c