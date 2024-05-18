#!/bin/sh

# this enables dependencies reset during development without image rebuild
if [ ! -d "node_modules" ]; then
  rm -rf yarn.lock package-lock.json
  yarn install
fi

# always migrate during startup
yarn run migrate
# run command
yarn run dev
