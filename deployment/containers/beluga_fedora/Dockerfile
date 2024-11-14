# Use Fedora as the base image
FROM fedora:latest

# Install Python and virtual environment tools
RUN dnf install -y python3 python3-pip python3-virtualenv && \
    dnf clean all

# Set the working directory
WORKDIR /app

# Copy the application files
COPY websocket-pty.py requirements.txt /app/

# Create and activate a virtual environment, then install dependencies
RUN python3 -m venv /app/venv && \
    . /app/venv/bin/activate && \
    pip install -r requirements.txt

# Expose the port
EXPOSE 5000

# Run the application within the virtual environment
CMD ["/app/venv/bin/python", "websocket-pty.py"]

