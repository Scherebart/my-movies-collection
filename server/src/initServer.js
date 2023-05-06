const path = require("path");

const express = require("express");
const expressHttpProxy = require("express-http-proxy")

const connectToSqlite = require("./connectToSqlite");
const apiRouter = require("./routerApi");
const { EnvType } = require("../../constants");

const WEB_DIST = path.join(__dirname, "../../web/dist");

module.exports = async ({ envType, sqliteConfig, apiKeyOmdb, port }) => {
  const sqlite = connectToSqlite(sqliteConfig);

  const app = express();
  app.use(async (req, res, next) => {
    req.sqlite = sqlite;

    const userId = req.get("user-id");
    let userFromDb = null;
    if (userId) {
      userFromDb = sqlite
        .prepare("SELECT * FROM users WHERE id = ?")
        .get(userId);

      if (userFromDb) {
        userFromDb.movies = JSON.parse(userFromDb.movies);
        req.user = userFromDb;
      } else {
        req.user = null;
      }
    }

    next();
  });
  app.use(express.json());
  app.use("/api", apiRouter({ apiKeyOmdb }));
  if (envType === EnvType.DEV) {
    app.use("/", expressHttpProxy("localhost:5173"));
  } else {
    app.use(express.static(WEB_DIST));
  }
  app.use((err, req, res, next) => {
    console.error('[ROOT]', err);
    return res.status(500).send({ error: "Unexpected error occured" });
  });

  const server = app.listen(port, () => {
    if (envType !== EnvType.TEST) {
      console.log(
        "\x1b[32m ➜  \x1b[0m\x1b[37mWeb server: \x1b[0m\x1b[36m%s\x1b[0m",
        `http://localhost:${port}`
      );
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
