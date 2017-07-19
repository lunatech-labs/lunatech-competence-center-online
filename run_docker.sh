#!/usr/bin/env bash

cd backend/target/docker/stage
docker build -t learn .
docker run -p 8081:8080 -ti learn