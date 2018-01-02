FROM node:slim

ARG USER_UID
ARG NAME=polymer

RUN apt-get update && apt-get -y install git
RUN npm install -g gulp bower polymer-cli --unsafe-perm 

RUN groupadd $NAME 
RUN useradd -g $NAME -u $USER_UID -m $NAME

USER polymer

RUN mkdir -p /home/polymer/scripts
RUN mkdir -p /home/polymer/polymer-components
RUN mkdir -p /home/polymer/frontend
VOLUME /home/polymer/scripts
VOLUME /home/polymer/polymer-components
VOLUME /home/polymer/frontend

