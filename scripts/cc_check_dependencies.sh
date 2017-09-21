#!/bin/bash
set -e
set -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

function check_dependencies {
    #echo "Checking $1"
    local FILE=$1
    local DEPS=`jq -c '[.topics[].dependencies[]?] | unique | sort' $FILE`
    local IDS=`jq -c '[.topics[].id] | sort' $FILE`
    local OK=`jq -c '[.topics[].id] | contains('"$DEPS"')' $FILE`
    if [[ "$OK" = "false" ]]; then
        echo "There are unresolved dependencies for graph: "$FILE
        echo "Defined dependencies: "$DEPS
        echo "Defined IDs: "$IDS
        echo -e "Diff: \x1B[31m "`echo $DEPS | jq -c '. - '"$IDS"''`"\x1B[0"
        return 1
    fi
}

all_jsons=../core-curriculum/knowledge/*
files=$(ls $all_jsons.json | wc -l)

for file in $all_jsons; do
    check_dependencies $file
done
