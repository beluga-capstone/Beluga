# Run the tests and stop containers once tests finish
docker-compose up --build --abort-on-container-exit --exit-code-from test

# Clean up all containers, networks, and volumes after tests
docker-compose down --volumes