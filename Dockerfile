# DEPS INSTALLER
FROM node:12 as builder

# Add resources and install the npm packages
WORKDIR /tmp/altv/
ADD package.json package.json
RUN npm install

# SERVER
FROM stivik/altv:stable

# Add resources
COPY --from=builder /tmp/altv/node_modules node_modules
ADD resources resources

# Add config
ADD server.cfg.example      config/server.cfg
ADD database.json.example   resources/orp/server/configuration/database.json