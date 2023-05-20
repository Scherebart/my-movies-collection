const path = require("path");

const { pipe } = require("ramda");
require("dotenv").config();

const { EnvType } = require("./constants");

const envType = pipe(
  (env) => env ?? EnvType.DEV,
  (env) => env.toUpperCase()
)(process.env["NODE_ENV"]);

module.exports = {
  envType,
  apiServer: {
    port: 8080,
    privateKey: process.env['SERVER_PRIVATE_KEY'],
  },
  sqlite: {
    path: path.join(__dirname, ".db", "db.sqlite3"),
  },
  apiKeyOmdb: process.env['API_KEY_OMDB'],
};

console.log(process.env['SERVER_PRIVATE_KEY'])

