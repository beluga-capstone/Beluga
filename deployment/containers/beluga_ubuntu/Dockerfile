# Use Ubuntu as the base image
FROM ubuntu:latest

# Install Python, pip, and SSH server
RUN apt-get update && \
    apt-get install -y nodejs apt-utils openssh-server sudo && \
    apt-get clean

# Configure SSH server
RUN mkdir -p /run/sshd && \
    echo "PermitRootLogin yes" > /etc/ssh/sshd_config && \
    echo "PasswordAuthentication no" >> /etc/ssh/sshd_config

# Ensure SSH server permissions are correct
RUN chmod 755 /usr/sbin/sshd

# Set the working directory
WORKDIR /app

# Copy the application files
COPY websocket-pty.js requirements.txt fullchain.pem privkey.pem /app/

# Create and activate a virtual environment, then install dependencies
RUN python3 -m venv /app/venv && \
    . /app/venv/bin/activate && \
    pip install -r requirements.txt

# Expose the port for SSH (22) and the application (5000)
EXPOSE 22 5000

RUN useradd -ms /bin/bash student && \
    adduser student sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    chmod 777 /root/ && chmod +r /root/.bashrc

# Start SSH server and run the application
RUN printf "/usr/sbin/sshd\nsu - student -c 'node /app/websocket-pty.js'\n" >> /docker_entrypoint.sh
CMD ["/bin/bash", "/docker_entrypoint.sh"]
