FROM node:12.13.1-buster
LABEL maintainer="https://github.com/openface"
WORKDIR /altv

# By using this container, you must agree to the terms set forth by OpenRP
ARG TOS_AGREE
RUN : "${TOS_AGREE:?Terms of service must be agreed to.  Set TOS_AGREE=true if you agree with the terms.}"

# Build args are defined in docker-compose.yml
ARG SERVER_NAME
ARG SERVER_DESCRIPTION
ARG SERVER_PLAYERS
ARG SERVER_ANNOUNCE
ARG SERVER_TOKEN
ARG SERVER_WEBSITE
ARG SERVER_LANGUAGE
ARG SERVER_DEBUG
ARG SERVER_STREAMINGDISTANCE
ARG SERVER_PASSWORD
ARG ALTV_VERSION
ARG DISCORD_URL
ARG DISCORD_TOKEN

# Install OpenRP
COPY . /altv
RUN apt-get update && npm install

# Install Alt:V
RUN bash -c 'mkdir {data,modules,resources-data}' && \
    wget -nv --show-progress --progress=bar:force:noscroll -P . https://cdn.altv.mp/node-module/${ALTV_VERSION}/x64_linux/update.json && \
    wget -nv --show-progress --progress=bar:force:noscroll -P . https://cdn.altv.mp/server/${ALTV_VERSION}/x64_linux/altv-server && chmod +x altv-server && \
    wget -nv --show-progress --progress=bar:force:noscroll -P modules/ https://cdn.altv.mp/node-module/${ALTV_VERSION}/x64_linux/modules/libnode-module.so && \
    wget -nv --show-progress --progress=bar:force:noscroll -P . https://cdn.altv.mp/node-module/${ALTV_VERSION}/x64_linux/libnode.so.72 && \
    wget -nv --show-progress --progress=bar:force:noscroll -P data/ https://cdn.altv.mp/server/${ALTV_VERSION}/x64_linux/data/vehmodels.bin && \
    wget -nv --show-progress --progress=bar:force:noscroll -P data/ https://cdn.altv.mp/server/${ALTV_VERSION}/x64_linux/data/vehmods.bin && \
    wget -nv --show-progress --progress=bar:force:noscroll -P . https://cdn.altv.mp/others/start.sh && chmod +x start.sh

# OpenRP DB configuration
RUN echo '{\n\
\t"type": "postgres",\n\
\t"username": "postgres",\n\
\t"password": "postgres",\n\
\t"address": "db",\n\
\t"port": 5432,\n\
\t"dbname": "altv"\n\
}\n' > resources/orp/server/configuration/database.json
RUN cat resources/orp/server/configuration/database.json

# OpenRP TOS Agreement
RUN echo '{\n\
\t"author": "Author: https://github.com/stuyk/",\n\
\t"license": "License: GNU GENERAL PUBLIC LICENSE v3",\n\
\t"terms": [\n\
\t\t"By using this software for your Roleplay mode you agree to the following:",\n\
\t\t"Manipulation of bootscreen logos, and splash marks may not be removed. This data",\n\
\t\t"must be present and unmodified for each user that enters your server. Monetization",\n\
\t\t"of this game mode is STRICTLY PROHIBITED. You may NOT establish any form of monetization",\n\
\t\t"features in this gamemode. ",\n\
\t\t"Setting the agreement boolean below to true; means you AGREE to these terms and",\n\
\t\t"conditions. ",\n\
\t\t"If you have any issues with these conditions; contact Stuyk promptly.",\n\
\t\t"If you agree with these terms. Please type true.",\n\
\t\t"\u001b[31mINSTALL POSTGRES V11.5 BEFORE RUNNING THIS\u001b[0m"\n\
\t],\n\
\t"do_you_agree": '$TOS_AGREE'\n\
}\n' > resources/orp/terms-and-conditions.json
RUN cat resources/orp/terms-and-conditions.json

# OpenRP Discord configuration
RUN echo '{\n\
\t"discord": "'$DISCORD_URL'",\n\
\t"token": "'$DISCORD_TOKEN'"\n\
}\n' > resources/orp/server/discord/configuration.json
RUN cat resources/orp/server/discord/configuration.json

# AltV configuration
RUN echo '\
name: "'$SERVER_NAME'"\n\
host: 0.0.0.0\n\
port: 7788\n\
players: "'$SERVER_PLAYERS'"\n\
announce: "'$SERVER_ANNOUNCE'"\n\
gamemode: ORP\n\
website: "'$SERVER_WEBSITE'"\n\
language: "'$SERVER_LANGUAGE'"\n\
description: "'$SERVER_DESCRIPTION'"\n\
modules: [ node-module ]\n\
resources: [ orp, hospital-pillbox, club-bahama, comedy-club ]\n\
token: "'$SERVER_TOKEN'"\n\
debug: "'$SERVER_DEBUG'"\n\
streamingDistance: "'$SERVER_STREAMINGDISTANCE'"\n\
password: "'$SERVER_PASSWORD'"\n\
' > server.cfg
RUN cat server.cfg

# Don't write to log file - let Docker log-driver handle it
RUN ln -s /dev/null server.log

# Start AltV Server
USER 0
ENTRYPOINT ["/altv/start.sh"]
CMD ["bash"]