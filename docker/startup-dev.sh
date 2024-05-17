#!/bin/sh

# always migrate during startup
yarn run migrate
# run command
yarn run dev
