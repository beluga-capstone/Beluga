# Use Fedora as the base image
FROM fedora:latest

# Install OpenSSH and websocketd
RUN dnf -y update && \
    dnf -y install openssh-server nodejs vim iproute make g++ && \
    dnf clean all

# Set up SSH configuration
RUN mkdir /var/run/sshd && \
    echo 'root:password' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    ssh-keygen -A

# Configure SSH daemon
RUN echo "AllowTcpForwarding yes" >> /etc/ssh/sshd_config && \
    echo "GatewayPorts yes" >> /etc/ssh/sshd_config

# Start the SSH service
RUN systemctl enable sshd

# Expose port 22 for SSH and port 8080 for websocketd
EXPOSE 8080
