#!/usr/bin/env bash
docker system prune
sbt buildFrontend docker:stage 
cp -R target/docker/stage/ image
docker build -t cco image/
cd image
docker run -p 8081:8080 -it cco
