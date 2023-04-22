const path = require("path");

module.exports = {
  client: "better-sqlite3",
  connection: {
    filename: path.join(__dirname,'.db', 'db-STUB.sqlite3'),
  },
  migrations: {
    tableName: "knex_migrations",
    directory: path.join(__dirname, "..", "migrations"),
  },
};
