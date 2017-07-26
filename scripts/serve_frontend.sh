#!/usr/bin/env bash

set -e
set -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..
# BUILD FRONTEND TODO, how are we going to do this properly?
cd cv-editor
bower link
cd ..
cd frontend
bower link cv-editor && bower install
polymer serve