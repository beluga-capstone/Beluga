FROM fedora:latest

RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

WORKDIR /shared

# Install necessary packages
RUN dnf --assumeyes install coreos-installer butane