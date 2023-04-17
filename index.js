const { sqlite, apiKeyOmdb, apiServer } = require("./config");
const initServer = require("./server/src/initServer");

initServer({ sqliteConfig: sqlite, apiKeyOmdb, ...apiServer });
