#!/bin/bash

# build
docker build -t beluga-registry ./deployment/registry/

# deploy
docker run -d --name beluga-registry -p 8000:5000 beluga-registry