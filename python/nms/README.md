## Initialize Database
* `docker pull mysql:8.0.25`
* `docker image tag mysql:8.0.25 servicenow_mysql:8.0.25`
* `docker save -o servicenow_mysql.tar servicenow_mysql:8.0.25`

* `docker run --name servicenow_mysql -p 3310:3306 -e MYSQL_ROOT_PASSWORD=sevonesnow -d servicenow_mysql:8.0.25`

## Initialize REDIS Broker
* `docker pull redis:alpine3.13`
* `docker image tag redis:alpine3.13 servicenow_redis:alpine3.13`
* `docker save -o servicenow_redis.tar servicenow_redis:alpine3.13` 

* `docker run --name servicenow_redis -p 6389:6379 -d servicenow_redis:alpine3.13`

## Initialize Application
* `docker rmi servicenow_itom:latest`
* `docker build -t servicenow_itom_v1 .`
* `docker save -o servicenow_itom_v1.tar servicenow_itom_v1`
* `tar -czvf servicenow_itom_v1.tar.gz servicenow_itom_v1.tar`

* `tar -cvzf servicenow-itom-v1.tar.gz servicenow_itom_v1.tar servicenow_redis.tar servicenow_mysql.tar config setup.sh docker-compose.yml`


* `docker run --network="host" -v /home/user/config:/root/nms-snow-development/config -it servicenow_itom`

