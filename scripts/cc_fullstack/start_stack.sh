#!/bin/bash

set -x

if [ ! -f .env ]; then 
    cat > .env <<EOF 
UID=${UID}
EOF
fi


if [ -z ${DOCKER_HOST} ]; then 
    docker-compose up
else
    DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export DOCKER_IP=$(docker-machine ip)
    envsubst < ${DIR}/confs/docker_machine_proxy_nginx.conf.template > ${DIR}/confs/docker_machine_proxy_nginx.conf

    docker-compose up &
    DOCKER_COMPOSE_PID=$!
    nginx -c ${DIR}/confs/docker_machine_proxy_nginx.conf &
    NGINX_PID=$!
    
    trap "kill -TERM ${DOCKER_COMPOSE_PID} && kill -term ${NGINX_PID}" SIGINT SIGTERM
    
    wait
fi
    



