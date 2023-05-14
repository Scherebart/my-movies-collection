const path = require("path");

const express = require("express");
const expressHttpProxy = require("express-http-proxy");
const jwt = require("jsonwebtoken");

const reader = require("./reader");
const { UserError, UnauthorizedError } = require("./errors");
const connectToSqlite = require("./connectToSqlite");
const routerApi = require("./routerApi");
const routerAuth = require("./routerAuth");
const { EnvType } = require("../../constants");

const WEB_DIST = path.join(__dirname, "../../web/dist");

module.exports = async ({
  envType,
  sqliteConfig,
  apiKeyOmdb,
  port,
  privateKey
}) => {
  const sqlite = connectToSqlite(sqliteConfig);
  const { getUser } = reader({ apiKeyOmdb });

  const app = express();
  app.use(async (req, res, next) => {
    req.sqlite = sqlite;

    let userId = null;

    const authHeader = req.get("authorization");
    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        ({ id: userId } = jwt.verify(token, privateKey));
      } catch (error) {
        // do nothing
      }
    }

    if (userId) {
      req.user = getUser(sqlite, userId);
    }

    next();
  });
  app.use(express.json());
  app.use("/auth", routerAuth({ privateKey }));
  app.use("/api", routerApi({ reader, apiKeyOmdb }));
  if (envType === EnvType.DEV) {
    app.use("/", expressHttpProxy("localhost:5173"));
  } else {
    app.use(express.static(WEB_DIST));
  }

  app.use((err, req, res, next) => {
    if (err) {
      res.type("json");

      if (err instanceof UserError) {
        return res.status(400).send({ error: err.message });
      } else if (err instanceof UnauthorizedError) {
        const { message } = err;
        return res.status(401).send({ error: message || "Unauthorized" });
      } else {
        console.error(err);
        return res.status(500).send({ error: "Unexpected error" });
      }
    }
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
