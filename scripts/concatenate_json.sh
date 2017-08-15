#!/bin/bash

all_jsons=../core-curriculum/knowledge/*
i=0
files=$(ls $all_jsons.json | wc -l)

for file in $all_jsons; do
    if [ $i -eq 0 ]
    then
        echo '['
    fi
    cat $file;
    i=$((i + 1))
    if [ $i -lt $files ]
    then
        echo ','
    fi
done
echo ']'
