const path = require("path");

const { pipe } = require("ramda");

const { EnvType } = require("./constants");

const envType = pipe(
  (env) => env ?? EnvType.DEV,
  (env) => env.toUpperCase()
)(process.env["NODE_ENV"]);

module.exports = {
  envType,
  apiServer: {
    port: 8080,
  },
  sqlite: {
    path: path.join(__dirname, "server", ".db", "db.sqlite3"),
  },
  apiKeyOmdb: "3b98b3f0",
};
