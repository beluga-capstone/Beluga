# Use Ubuntu as the base image
FROM ubuntu:latest

# Install Python, pip, and SSH server
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv openssh-server && \
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
COPY websocket-pty.py requirements.txt /app/

# Create and activate a virtual environment, then install dependencies
RUN python3 -m venv /app/venv && \
    . /app/venv/bin/activate && \
    pip install -r requirements.txt

# Expose the port for SSH (22) and the application (5000)
EXPOSE 22 5000

# Start SSH server and run the application
CMD ["/bin/bash", "-c", "/usr/sbin/sshd && /app/venv/bin/python websocket-pty.py"]
