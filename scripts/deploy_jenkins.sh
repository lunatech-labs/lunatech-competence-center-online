#!/usr/bin/env bash

set -e
set -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

cd backend/target/docker/stage/* .
chmod 755 opt/docker/bin/*
mkdir -p opt/docker/logs

rm -rf target

git init
git add .
git commit -m "Jenkins Build $BUILD_NUMBER"

GIT_SSH_COMMAND='ssh -i $IDENTITY_FILE'
git push $GIT_URL -i $IDENTITY_FILE
