#!/bin/bash

COLOR_OFF='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
BROWN='\033[0;33m'
BLUE='\033[0;34m'

if [ $1 == 'build' ]
then
  printf "${BROWN}Building docker images and containers${COLOR_OFF}\n"
  docker build -t microservice-image . 
  docker create -p 8001:8001 --name microservice microservice-image
elif [ $1 == 'start' ]
then
  printf "${GREEN}Starting containers${COLOR_OFF}\n"
  docker start microservice
elif [ $1 == 'test' ]
then
  printf "${GREEN}Starting containers${COLOR_OFF}\n"
  docker start microservice -a
elif [ $1 == 'stop' ]
then
  printf "${BLUE}Stopping containers${COLOR_OFF}\n"
  docker stop microservice
elif [ $1 == 'clean' ]
then
  printf "${RED}Cleaning up containers${COLOR_OFF}\n"
  docker rm microservice
elif [ $1 == 'purge' ]
then
  printf "${RED}Purging containers and images${COLOR_OFF}\n"
  docker rm microservice
  docker rmi microservice-image
fi
