const path = require("path");

const { EnvType } = require("./constants");

module.exports = {
  knex: {
    client: "better-sqlite3",
    connection: {
      filename: path.join(__dirname, ".db", "db.sqlite3"),
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.join(__dirname, "server", "migrations")
    },
  },
  apiKeyOmdb: "3b98b3f0",
  apiServer: {
    port: 8080
  },
  envType: process.env["NODE_ENV"] || EnvType.DEV
};
