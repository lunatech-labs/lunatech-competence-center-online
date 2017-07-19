#!/usr/bin/env bash

# BUILD FRONTEND TODO, how are we going to do this properly?
cd cv-editor
bower link
cd ..
cd frontend
bower link cv-editor && bower install
polymer build
# END

# BUILD BACKEND & DOCKER
cd ../backend
sbt buildFrontend docker:stage
# END

# ADD FRONTEND FILES TO DOCKER
mkdir -p target/docker/stage/opt/docker/frontend
cd ../frontend
mv -f build/default/** ../backend/target/docker/stage/opt/docker/frontend/
# END