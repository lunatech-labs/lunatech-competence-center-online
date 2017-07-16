#!/usr/bin/env bash
docker system prune
sbt clean docker:stage
cp -R target/docker/stage/ image
docker build --no-cache -t cco image/
cd image
docker run -p 8081:8080 -it cco
