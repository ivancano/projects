#!/bin/sh

mkdir -p /opt/ps/servicenow-itom-v1
mkdir -p /opt/ps/servicenow-itom-v1/db
# tar -xvzf servicenow-itom.tar.gz

docker load -i servicenow_mysql.tar
docker load -i servicenow_redis.tar
docker load -i servicenow_itom_v1.tar

docker-compose up -d
