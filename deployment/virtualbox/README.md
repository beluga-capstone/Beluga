### setup
```
python -m venv venv
source venv/bin/active
pip install -r requirements.txt
```

### overview
```
- generate-isos.py: uses butane, ignition, coreos, fcos to create custom fedora iso
- build.sh: uses custom fedora iso to build vms
```

### temp password gen
```
python3 -c 'import crypt,getpass;pw=getpass.getpass();print(crypt.crypt(pw) if (pw==getpass.getpass("Confirm: ")) else exit())'
```

### usage
```
./build.sh

login: core/example_pass
```
