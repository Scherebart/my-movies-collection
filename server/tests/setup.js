const path = require("path");
const { copyFileSync } = require("node:fs");

const axios = require("axios");

const initServer = require("../src/initServer");
const { EnvType } = require("../src/constants");
const testHelpers = require("./testHelpers");

const DB_FILE = "db.sqlite3";
const DB_STUB_FILE = "db_stub.sqlite3";
const SERVER_PORT = 8081;

function functional() {
  let closeServer;
  let getDbProvider;

  const Tester = {};

  beforeAll(async () => {
    // Object.assign(
    ({ closeServer, getDbProvider } = await initServer({
      knex: {
        client: "better-sqlite3",
        connection: {
          filename: path.join(__dirname, DB_FILE),
        },
        useNullAsDefault: true,
      },
      port: SERVER_PORT,
      envType: EnvType.TEST,
    }));

    Object.assign(Tester, testHelpers(getDbProvider().getKnex()));
  });

  beforeEach(() => {
    // db reset
    copyFileSync(
      path.join(__dirname, DB_STUB_FILE),
      path.join(__dirname, DB_FILE)
    );
  });

  afterAll(async () => {
    await closeServer();
  });

  const axiosBaseConfig = {
    baseURL: `http://localhost:${SERVER_PORT}/`,
    validateStatus: () => true,
  };

  function asUser(userId) {
    const axiosInstance = axios.create({
      ...axiosBaseConfig,
      headers: {
        "user-id": userId,
      },
    });

    return axiosInstance;
  }

  function asGuest() {
    const axiosInstance = axios.create({
      ...axiosBaseConfig,
    });
    return axiosInstance;
  }

  return {
    asUser,
    asGuest,
    Tester,
  };
}

module.exports = {
  functional,
  knexfile: {
    client: "better-sqlite3",
    connection: {
      filename: path.join(__dirname, DB_STUB_FILE),
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.join(__dirname, "..", "migrations"),
    },
  },
};
