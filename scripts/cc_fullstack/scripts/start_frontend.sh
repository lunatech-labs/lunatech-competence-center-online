#!/bin/bash

set -x

/root/scripts/link_local_polymer_components.sh

polymer serve --hostname 0.0.0.0 --port 8080 /root/frontend
