# import os
# import textwrap
# from pathlib import Path

# # docker buildx create --name beluga_builder
# # docker buildx use beluga_builder

# # sudo docker buildx build --platform linux/amd64 -t ctf-fedora -f ctf-fedora.dockerfile --load .

# # step 1
# # docker run --security-opt label=disable -v {CURRENT_DIR}:/shared --user {USER_ID}:{GROUP_ID} --rm -it ctf-fedora /bin/bash
# #
# # step 2
# # coreos-installer download -s stable -p metal -f iso -C .
# #
# # step 3
# #

# CURRENT_DIR = Path.cwd()
# USER_ID = os.getuid()
# GROUP_ID = os.getgid()

# # setup vars
# BUILD_PATH = "build/"
# FCOS_YAML_PATH = "fcos.yml"
# DOCKERFILE_PATH = "ctf-fedora.dockerfile"
# SHARED_DIR = "/shared/"
# VM_NAME = "NEW_VM"

# # build vars
# BUTANE_PATH = BUILD_PATH + VM_NAME + ".bu"
# CUSTOM_ISO_PATH = BUILD_PATH + VM_NAME + ".iso"
# IGN_PATH = CUSTOM_ISO_PATH + ".ign"


# setup1 = "docker buildx create --name beluga_builder"
# setup2 = "docker buildx use beluga_builder"

# build_image = f"docker buildx build --platform linux/amd64 -t ctf-fedora -f {DOCKERFILE_PATH} --load ."
# run_image = f"""docker run --security-opt label=disable -v {CURRENT_DIR}:{SHARED_DIR} --user {USER_ID}:{GROUP_ID} --rm -it ctf-fedora /bin/bash"""
# get_raw_iso = f"coreos-installer download -s stable -p metal -f iso -C {BUILD_PATH}"
# raw_iso_path = [f for f in Path(BUILD_PATH).glob("*.iso")][0]

# import re
# import yaml

# def replace_variables(template, variables):
#     def replace_var(match):
#         var_name = match.group(1)
#         return str(variables.get(var_name, f'#{{{var_name}}}'))

#     pattern = r'#\{([^}]+)\}'
#     replaced_content = re.sub(pattern, replace_var, template)
#     return replaced_content

# def process_fcos_yaml(yaml_file_path, variables):
#     with open(yaml_file_path, 'r') as file:
#         template_content = file.read()
    
#     replaced_content = replace_variables(template_content, variables)
    
#     # Parse the YAML content
#     yaml_data = yaml.safe_load(replaced_content)
    
#     return yaml_data

# custom_fcos_yaml = process_fcos_yaml(FCOS_YAML_PATH, {
#     'yescrypt': 'hashed_password_here',
#     'ssh_identity': 'ssh-rsa AAAAB3NzaC1yc2E...',
#     'hostname': 'my-fcos-vm',
#     'interface': 'enp0s3',
#     'ip': '192.168.1.100',
#     'prefix': '24',
#     'gateway': '192.168.1.1',
#     'registry_ip': '192.168.1.200'
# })

# command = f"butane --strict --pretty {custom_fcos_yaml} -o {IGN_PATH}"
# print(command)




import os
import re
import yaml
from pathlib import Path

# Constants
CURRENT_DIR = Path.cwd()
USER_ID = os.getuid()
GROUP_ID = os.getgid()

# File paths
BUILD_PATH = "iso/"
VM_NAME = "NEW_VM"
FCOS_TEMPLATE_PATH = "fcos.yml"
CUSTOM_FCOS_PATH = BUILD_PATH + VM_NAME + ".yml"
DOCKERFILE_PATH = "ctf-fedora.dockerfile"
SHARED_DIR = "/shared/"

# Build variables
BUTANE_PATH = BUILD_PATH + VM_NAME + ".bu"
CUSTOM_ISO_PATH = BUILD_PATH + VM_NAME + ".iso"
IGN_PATH = CUSTOM_ISO_PATH + ".ign"

# Docker commands
setup1 = "docker buildx create --name beluga_builder"
setup2 = "docker buildx use beluga_builder"
build_image = f"docker buildx build --platform linux/amd64 -t ctf-fedora -f {DOCKERFILE_PATH} --load ."
run_image = f"docker run --security-opt label=disable -v {CURRENT_DIR}:{SHARED_DIR} --user {USER_ID}:{GROUP_ID} --rm -it ctf-fedora /bin/bash"
get_raw_iso = f"coreos-installer download -s stable -p metal -f iso -C {BUILD_PATH}"

# Locate raw ISO file
raw_iso_path = [f for f in Path(BUILD_PATH).glob("*.iso")][0]

# Function to replace variables in templates
def replace_variables(template, variables):
    def replace_var(match):
        var_name = match.group(1)
        return str(variables.get(var_name, f'#{var_name}'))

    pattern = r'#\{([^}]+)\}'
    replaced_content = re.sub(pattern, replace_var, template)
    return replaced_content

# Process Fedora CoreOS YAML file with variable replacement, write output to a file
def process_fcos_yaml(yaml_file_path, variables, output_path):
    with open(yaml_file_path, 'r') as file:
        template_content = file.read()
    
    replaced_content = replace_variables(template_content, variables)
    
    # Parse the YAML content
    yaml_data = yaml.safe_load(replaced_content)
    
    # Write the processed YAML data to the output file
    with open(output_path, 'w') as outfile:
        yaml.dump(yaml_data, outfile)
    
    return output_path

# Replace placeholders in the FCOS YAML file and write it to a new file
processed_yaml_file = process_fcos_yaml(FCOS_TEMPLATE_PATH, {
    'yescrypt': 'hashed_password_here',
    'ssh_identity': 'ssh-rsa AAAAB3NzaC1yc2E...',
    'hostname': 'my-fcos-vm',
    'interface': 'enp0s3',
    'ip': '192.168.1.100',
    'prefix': '24',
    'gateway': '192.168.1.1',
    'registry_ip': '192.168.1.200'
}, CUSTOM_FCOS_PATH)

generate_ign = f"butane --strict --pretty {CUSTOM_FCOS_PATH} -o {IGN_PATH}"

command = f"coreos-installer iso customize --force --dest-device /dev/sda --dest-ignition {IGN_PATH} -o {CUSTOM_ISO_PATH} {raw_iso_path}"
print(command)