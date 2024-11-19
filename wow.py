import docker

# Initialize Docker client
client = docker.from_env()

def get_container_id_by_name(container_name):
    try:
        # Get all containers
        containers = client.containers.list(all=True)  # Include stopped containers
        for container in containers:
            if f"/{container_name}" in container.attrs['Name'] or container_name in container.name:
                return container.id  # Return the container ID
        return None  # If not found
    except Exception as e:
        print(f"Error: {e}")
        return None

# Replace with your container name
container_name = "asd_container"
container_id = get_container_id_by_name(container_name)

if container_id:
    print(f"Container ID for '{container_name}': {container_id}")
else:
    print(f"Container '{container_name}' not found.")

