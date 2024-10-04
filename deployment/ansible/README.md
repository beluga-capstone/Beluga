### setup
setup.sh will create a new hostonly adapter. if you alrdy have one, remove line 34 (VBoxManage hostonlyif create). also install the requirements (ansible), and update iso path in setup.sh and device in kickstart commands
```
pip install -r requirements.txt
```

### main usage
setup.sh: vms, network, iso, storage, etc
deploy.sh: run the vms
undeploy.sh: stop the vms

### other
delete.sh: delete the vms
anaconda-ks.cfg: the kickstart file to automate initial installation process

### do things on the vms
ansible-playbook -i inventory.ini playbook.yaml
