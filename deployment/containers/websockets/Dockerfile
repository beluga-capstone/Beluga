#FROM fedora:latest

#RUN dnf -y update && \
#    dnf -y install openssh-websocket-pty.python3 python3-pip && \
#    dnf clean all

# ssh config
##RUN echo 'root:password' | chpasswd && \
#    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
#    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
#    ssh-keygen -A

#RUN echo "AllowTcpForwarding yes" >> /etc/ssh/sshd_config && \
#    echo "GatewayPorts yes" >> /etc/ssh/sshd_config

#RUN systemctl enable sshd


FROM python:3.10
# run websocket server
WORKDIR /app
COPY websocket-pty.py requirements.txt /app/
#RUN python3 -m venv venv
RUN pip install -r requirements.txt
#RUN . venv/bin/activate && pip install --no-cache-dir -r requirements.txt

EXPOSE 5000 
CMD ["python","websocket-pty.py"]
