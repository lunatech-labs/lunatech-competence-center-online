#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rm -f $DIR/local_nginx_amend.conf

sed "s%\$DIR%$DIR%" $DIR/local_nginx.conf >$DIR/local_nginx_amend.conf

nginx -c $DIR/local_nginx_amend.conf

rm -f $DIR/local_nginx_amend.conf
