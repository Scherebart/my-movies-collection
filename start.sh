#!/bin/sh

mkdir -p .db

pnpm migrate:up

node ./index.js
