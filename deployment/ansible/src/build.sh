#!/bin/bash



# Build the Docker image
docker build -t ctf-fedora:latest -f ctf-fedora.dockerfile .

# Set up variables
CURRENT_DIR=$(pwd)
USER_ID=$(id -u)
GROUP_ID=$(id -g)
ISO_PATH="$CURRENT_DIR/deploy_data/iso"
FCOS_YML_PATH="$CURRENT_DIR/fcos.yml"
IGN_PATH="$ISO_PATH/config.ign"
ISO_OUTPUT="$ISO_PATH/custom_fcos.iso"
VM_NAME="my_vm"

# Create ISO directory
mkdir -p "$ISO_PATH"

# Download CoreOS ISO
docker run --security-opt label=disable \
  --volume "$CURRENT_DIR:$CURRENT_DIR" \
  --user "$USER_ID:$GROUP_ID" \
  --workdir /pwd --rm ctf-fedora \
  coreos-installer download -s stable -p metal -f iso -C "$ISO_PATH"

# Find the downloaded ISO
BASE_ISO=$(ls "$ISO_PATH"/*.iso | head -n 1)

# Generate Ignition config from fcos.yml
docker run --security-opt label=disable \
  --volume "$CURRENT_DIR:$CURRENT_DIR" \
  --user "$USER_ID:$GROUP_ID" \
  --workdir /pwd --rm ctf-fedora \
  butane --strict --pretty "$FCOS_YML_PATH" -o "$IGN_PATH"

# Customize ISO
docker run --security-opt label=disable \
  --volume "$CURRENT_DIR:$CURRENT_DIR" \
  --user "$USER_ID:$GROUP_ID" \
  --workdir /pwd --rm ctf-fedora \
  coreos-installer iso customize \
    --force \
    --dest-device /dev/sda \
    --dest-ignition "$IGN_PATH" \
    -o "$ISO_OUTPUT" \
    "$BASE_ISO"

# Set permissions on the output ISO
chmod go+r "$ISO_OUTPUT"

echo "Custom Fedora CoreOS ISO created at $ISO_OUTPUT"