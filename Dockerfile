FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /home/node
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

ARG VITE_HOME_URL
RUN VITE_HOME_URL=$VITE_HOME_URL pnpm build

ENV NODE_ENV PROD
ENTRYPOINT [ "./start.sh" ]
