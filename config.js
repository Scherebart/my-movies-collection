const path = require("path");

module.exports = {
  knex: {
    client: "better-sqlite3",
    connection: {
      filename: path.join(__dirname, ".db", "db.sqlite3"),
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  apiKeyOmdb: "3b98b3f0",
  apiServer: {
    port: 8080
  }
};
