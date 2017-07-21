#!/usr/bin/env bash

set -e
set -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

mv backend/target/docker/stage/* .
chmod 755 opt/docker/bin/*
mkdir -p opt/docker/logs

rm -rf target
git add .
git commit -m "Jenkins Build $BUILD_NUMBER"
