const path = require("path");
const express = require("express");
const liveReload = require("livereload");
const connectLiveReload = require("connect-livereload");

const connectToDB = require("./connectToDB");
const apiRouter = require("./apiRouter");

const liveReloadServer = liveReload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

module.exports = async ({ knex: knexConfig, apiKeyOmdb, port }) => {
  const db = await connectToDB(knexConfig);
  const server = express();
  server.use(connectLiveReload());
  server.use(express.static(path.join(__dirname, "public")));

  server.use((req, res, next) => {
    req.knexBuilder = db.getKnex();
    req.user = { id: 3 };
    next();
  });
  server.use("/api", apiRouter);

  server.listen(port, () =>
    console.log(`The server is listening on port ${port} ...`)
  );
};
