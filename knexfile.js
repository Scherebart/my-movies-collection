const path = require("path");

module.exports = {
  client: "better-sqlite3",
  connection: {
    filename: path.join(__dirname, ".db", "db.sqlite3"),
  },
  useNullAsDefault: true,
  migrations: {
    tableName: "knex_migrations",
    directory: path.join(__dirname, "server", "migrations"),
  },
  seeds:{
    directory: path.join(__dirname, "server", "seeds"),
  }
};
