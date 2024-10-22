FROM fedora:latest

RUN dnf -y update && \
    dnf -y install openssh-server nodejs vim iproute make g++ && \
    dnf clean all

# ssh config
RUN mkdir /var/run/sshd && \
    echo 'root:password' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    ssh-keygen -A

RUN echo "AllowTcpForwarding yes" >> /etc/ssh/sshd_config && \
    echo "GatewayPorts yes" >> /etc/ssh/sshd_config

RUN systemctl enable sshd


# node config
WORKDIR /app
COPY server.js .
RUN npm init -y; npm i ws node-pty

# run ssh and websocket server
CMD ["sh", "-c", "/usr/sbin/sshd && node server.js"]
EXPOSE 8080
