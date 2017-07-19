#!/usr/bin/env bash
#mkdir -p dockerdir
#mkdir -p dockerdir/opt/docker/frontend
#mkdir -p dockerdir/opt/docker/logs
#mv frontend/build/default/* dockerdir/opt/docker/frontend
#chmod 755 dockerdir/opt/docker/bin/*

cd backend/target/docker/stage
#mkdir -p opt/docker/frontend
mkdir -p opt/docker/logs
chmod 755 opt/docker/bin/*

rm -rf target
git add .
git commit -m "Jenkins Build $BUILD_NUMBER"