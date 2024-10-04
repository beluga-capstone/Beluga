
CURRENT_DIR=$(pwd)
USER_ID=$(id -u)
GROUP_ID=$(id -g)
ISO_PATH="$CURRENT_DIR/deploy_data/iso"
FCOS_YML_PATH="$CURRENT_DIR/fcos.yml"
IGN_PATH="$ISO_PATH/config.ign"
ISO_OUTPUT="$ISO_PATH/custom_fcos.iso"
VM_NAME="my_vm"