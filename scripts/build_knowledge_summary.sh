#!/bin/bash

./concatenate_json.sh | jq '[.[] | {id, name, description, tags, image}]'
