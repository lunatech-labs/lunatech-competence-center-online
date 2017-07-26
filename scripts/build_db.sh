#!/usr/bin/env bash


docker build -t learndb ../backend/db
docker run -p 5432:5432 -t learndb