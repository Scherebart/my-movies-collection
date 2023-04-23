const { envType, apiServer, sqlite, apiKeyOmdb } = require("./config");
const initServer = require("./server/src/initServer");

initServer({ envType, sqliteConfig: sqlite, apiKeyOmdb, ...apiServer });
