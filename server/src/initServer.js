const path = require("path");
const express = require("express");
const liveReload = require("livereload");
const connectLiveReload = require("connect-livereload");

const connectToDB = require("./connectToDB");
const apiRouter = require("./routerApi");
const { EnvType, TABLE_USERS } = require("./constants");

module.exports = async ({ envType, knex: knexConfig, apiKeyOmdb, port }) => {
  const dbProvider = await connectToDB(knexConfig);

  const app = express();
  app.use(express.static(path.join(__dirname, "public")));
  app.use(async (req, res, next) => {
    const knex = dbProvider.getKnex();
    req.knex = knex;

    const userId = req.get("user-id");
    if (userId) {
      const userFromDb = await knex(TABLE_USERS).where({ id: userId }).first();
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
    await new Promise((success, error) =>
      server.close((err) => {
        if (err) {
          return error(err);
        }

        success();
      })
    );

    await dbProvider.destroy();
  }

  return {
    closeServer,
    getDbProvider() {
      return dbProvider;
    },
  };
};
