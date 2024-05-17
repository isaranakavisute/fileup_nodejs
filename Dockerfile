FROM node:20-alpine

# install necessary packages
RUN apk update \
  && apk upgrade --no-cache \
  && apk add --no-cache \
  mariadb-client

# set working directory
WORKDIR /app

# copy source files
COPY . .
# setup startup file
COPY docker/startup-prod.sh /startup.sh

# pre-install packages
RUN rm -rf node_modules/ yarn.lock package-lock.json \
  && yarn install

# TODO: do something extra in production image
# ...

CMD ["sh", "/startup.sh"]
