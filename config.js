const path = require("path");

const { EnvType } = require("./constants");

module.exports = {
  sqlite: {
    path: path.join(__dirname, "server", ".db", "db.sqlite3"),
  },
  apiKeyOmdb: "3b98b3f0",
  apiServer: {
    port: 8080,
  },
  envType: process.env["NODE_ENV"] || EnvType.DEV,
};
