const { knex, apiKeyOmdb, apiServer } = require("./config");
const initServer = require("./server/initServer");

initServer({ knex, apiKeyOmdb, ...apiServer });
