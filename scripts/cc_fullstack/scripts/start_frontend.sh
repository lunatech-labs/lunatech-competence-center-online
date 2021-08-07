#!/bin/bash

set -x

/home/polymer/scripts/link_local_polymer_components.sh


polymer serve --hostname 0.0.0.0 --port 8080 /home/polymer/frontend
