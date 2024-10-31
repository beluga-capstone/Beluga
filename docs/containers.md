### Build container
```
cd deployment/containers/default
docker build -t beluga .
```

### Run container
```
docker run -d -p 8080:8080 beluga
```