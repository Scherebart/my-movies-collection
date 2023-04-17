const path = require("path");
const express = require("express");
const liveReload = require("livereload");
const connectLiveReload = require("connect-livereload");

const connectToSqlite = require("./connectToSqlite");
const apiRouter = require("./routerApi");
const { EnvType } = require("../../constants");

module.exports = async ({ envType, sqliteConfig, apiKeyOmdb, port }) => {
  const sqlite = connectToSqlite(sqliteConfig);

  const app = express();
  app.use(express.static(path.join(__dirname, "public")));
  app.use(async (req, res, next) => {
    req.db = sqlite;

    const userId = req.get("user-id");
    if (userId) {
      const userFromDb = sqlite
        .prepare(`SELECT * FROM users WHERE id = ?`)
        .get(userId);
      req.user = userFromDb;
    }

    next();
  });
  app.use(express.json());
  app.use("/api", apiRouter);

  if (envType === EnvType.DEV) {
    const liveReloadServer = liveReload.createServer();
    liveReloadServer.watch(path.join(__dirname, "public"));
    liveReloadServer.server.once("connection", () => {
      setTimeout(() => {
        liveReloadServer.refresh("/");
      }, 100);
    });
    app.use(connectLiveReload());
  }

  const server = app.listen(port, () => {
    if (envType !== EnvType.TEST) {
      console.log(`The server is listening on port ${port} ...`);
    }
  });

  async function closeServer() {
    await new Promise((resolve, reject) =>
      server.close((err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      })
    );

    sqlite.close();
  }

  return {
    closeServer,
    sqlite,
  };
};
