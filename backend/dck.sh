#!/usr/bin/env bash
docker system prune
sbt buildFrontend docker:stage 
cp -R target/docker/stage/ image
docker build -t cco image/
cd image
docker volume create logs
docker run --name competence_center -v /logs:/logs -p 8081:8080 -p 9000:9000 -it cco
