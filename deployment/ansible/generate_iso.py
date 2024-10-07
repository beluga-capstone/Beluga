import os
import argparse
import logging
from pathlib import Path
import re
import yaml
import docker
from contextlib import contextmanager

###########################
########## SETUP ##########
###########################
CURRENT_DIR = Path.cwd()
USER_ID = os.getuid()
GROUP_ID = os.getgid()
SHARED_DIR = Path("/shared/")
ISO_PATH = Path("./iso/")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def parse_arguments():
    """Parses command-line arguments."""
    parser = argparse.ArgumentParser(description='Build custom Fedora CoreOS images.')
    parser.add_argument('-v', '--vm_name', type=str, default="Beluga_VM", help='Name of the virtual machine')
    parser.add_argument('-i', '--image_name', type=str, default="beluga-image", help='Name of the Docker image')
    parser.add_argument('-f', '--fcos_template_path', type=str, default="config/fcos-template.yml", help='Path to the FCOS template')
    parser.add_argument('-d', '--dockerfile_path', type=str, default="beluga.dockerfile", help='Path to the Dockerfile')
    parser.add_argument('-c', '--config_path', type=str, default="fcos-config-example.yml", help='Path to the configuration file')
    return parser.parse_args()

def get_output_paths(vm_name):
    """Generate output paths based on the VM name."""
    custom_fcos_path = ISO_PATH / f"{vm_name}.yml"
    custom_iso_path = ISO_PATH / f"{vm_name}.iso"
    custom_ign_path = ISO_PATH / f"{vm_name}.iso.ign"
    ISO_PATH.mkdir(exist_ok=True)
    return custom_fcos_path, custom_iso_path, custom_ign_path

###########################
########## DOCKER #########
###########################
class DockerManager:
    def __init__(self):
        self.client = docker.from_env()

    def build_image(self, image_name, dockerfile_path):
        """Builds a Docker image"""
        try:
            self.client.images.build(
                path=str(CURRENT_DIR),
                dockerfile=dockerfile_path, 
                tag=image_name
            )
        except docker.errors.BuildError as e:
            logger.error(f"Failed to build Docker image: {e}")
            raise

    def run_container_with(self, image_name, command):
        """Runs command on a container"""
        try:
            self.client.containers.run(
                image=image_name, 
                user=USER_ID, 
                volumes={str(CURRENT_DIR): {'bind': str(SHARED_DIR), 'mode': 'rw'}},
                remove=True,
                command=command
            )
        except docker.errors.ContainerError as e:
            logger.error(f"Container execution failed: {e}")
            raise

###########################
######### UTILITY #########
###########################
def replace_variables(fcos_template, variables):
    """Replace variables in the FCOS template."""
    def replace_var(match):
        var_name = match.group(1)
        return str(variables.get(var_name, f'#{var_name}'))

    pattern = r'#\{([^}]+)\}'
    return re.sub(pattern, replace_var, fcos_template)

def substitute_fcos_template(fcos_config_yml_path, variables, output_path):
    """Substitute variables in the FCOS template and write to output file."""
    try:
        with open(fcos_config_yml_path, 'r') as file:
            fcos_template = file.read()
        
        replaced_content = replace_variables(fcos_template, variables)
        yaml_data = yaml.safe_load(replaced_content)
        
        with open(output_path, 'w') as outfile:
            yaml.dump(yaml_data, outfile)
    except (IOError, yaml.YAMLError) as e:
        logger.error(f"Failed to process FCOS template: {e}")
        raise

def load_config(config_path):
    """Load configuration from YAML file."""
    try:
        with open(config_path, 'r') as file:
            return yaml.safe_load(file)
    except (IOError, yaml.YAMLError) as e:
        logger.error(f"Failed to load configuration: {e}")
        raise

@contextmanager
def log_process(action, message):
    """Logs the start and end of a process."""
    logger.info(f"START ({action} | {message})")
    yield
    logger.info(f"END ({action} | {message})")

###########################
########## MAIN ###########
###########################
def main():
    # setup
    args = parse_arguments()
    fcos_config = load_config(args.config_path)
    custom_fcos_path, custom_iso_path, custom_ign_path = get_output_paths(args.vm_name)

    docker_manager = DockerManager()

    # build docker image
    with log_process("building the image", args.image_name):
        docker_manager.build_image(args.image_name, args.dockerfile_path)
    
    # fetch coreos iso if it doesn't exist in build path
    raw_iso_path = next(ISO_PATH.glob("*.iso"), None)
    if not raw_iso_path:
        with log_process("fetching coreos iso into dir", str(ISO_PATH)):
            docker_manager.run_container_with(args.image_name, f"""
                coreos-installer download 
                --stream stable 
                --platform metal 
                --format iso 
                --directory {ISO_PATH}
            """)
        raw_iso_path = next(ISO_PATH.glob("*.iso"))

    # create custom fcos config
    with log_process("creating custom fcos config", str(custom_fcos_path)):
        substitute_fcos_template(Path(args.fcos_template_path), fcos_config, custom_fcos_path)

    # create custom ignition file
    with log_process("creating custom ignition file", str(custom_ign_path)):
        docker_manager.run_container_with(args.image_name, f"""
            butane --strict 
            --pretty {custom_fcos_path}
            --output {custom_ign_path}
        """)

    # create custom iso
    with log_process("creating custom iso", str(custom_iso_path)):
        docker_manager.run_container_with(args.image_name, f"""
            coreos-installer iso customize
            --force --dest-device /dev/sda
            --dest-ignition {custom_ign_path}
            --output {custom_iso_path}
            {raw_iso_path}
        """)

if __name__ == "__main__":
    main()