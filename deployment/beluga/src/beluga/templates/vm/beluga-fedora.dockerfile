FROM fedora:latest

RUN dnf --assumeyes install coreos-installer butane

ENTRYPOINT ["/bin/bash", "-l", "-c"]
