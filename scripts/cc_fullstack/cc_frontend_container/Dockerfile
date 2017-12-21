FROM node:slim

RUN apt-get update && apt-get -y install git
RUN npm install -g gulp bower polymer-cli --unsafe-perm 

RUN echo '{ "allow_root": true }' > /root/.bowerrc

RUN mkdir -p /root/scripts
RUN mkdir -p /root/polymer-components
RUN mkdir -p /root/frontend
VOLUME /root/scripts
VOLUME /root/polymer-components
VOLUME /root/frontend

WORKDIR /root
