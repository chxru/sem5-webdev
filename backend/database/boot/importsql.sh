#!/bin/bash

# confirm args are supplied
if [ $# -eq 0 ]
then
    echo "container name is missing!"
    exit 1
fi

# args
CONTAINER=$1

# check docker is running
# https://gist.github.com/paulosalgado/91bd74c284e262a4806524b0dde126ba
DOCKER_RUNNING=$(docker inspect --format="{{.State.Running}}" $CONTAINER 2> /dev/null)

if [ "$DOCKER_RUNNING" == "false" ]; then
    echo $CONTAINER is not running # "CRITICAL - $CONTAINER is not running."
    exit 1
fi

# remove old sql files from the container
docker exec $CONTAINER rm -rf ./sem5-sql/

# filter all sql files in the directory
for p in $PWD/database/boot/*.sql
do
    f=$(basename $p)
    
    # copy sql file to the container
    docker cp $p $CONTAINER:./home/$f
    
    # import sql to postgres
    docker exec $CONTAINER psql -U charukahs -d ee5209 -f ./home/$f
done
exit 0