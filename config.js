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
    privateKey:
      "0e7aa33f12bbd57d8b3948a1c6349a7e492474ce5723c68a137ad1edd40ac992032777ff11f34f68385bc315df9aa3e4c6fab04088d81414d198c00c94702dce",
  },
  sqlite: {
    path: path.join(__dirname, "server", ".db", "db.sqlite3"),
  },
  apiKeyOmdb: "3b98b3f0",
};
