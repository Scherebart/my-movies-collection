const path = require("path");
const { copyFileSync, rmSync } = require("node:fs");

const axios = require("axios");
const { v4: uuid } = require("uuid");

const initServer = require("../src/initServer");
const { EnvType } = require("../../constants");
const testHelpers = require("./testHelpers");

const DB_STUB_FILE = path.join(__dirname, ".db", "db-STUB.sqlite3");
const DB_FILE = path.join(__dirname, ".db", `db-test-${uuid()}.sqlite3`);
const SERVER_PORT = 8081;

function functional() {
  let closeServer;
  let sqlite;

  const Tester = {};

  beforeAll(async () => {
    /**
     * TODO (for consideration):
     * We could just do:
     *
     * BEGIN CONCURRENT;
     * ....
     * ROLLBACK
     *
     * instead of copying the db file for each run of a spec file.
     *
     * However this feature is not present in the trunk branch of the sqlite repo,
     * which build is used by better-sqlite3.
     * Most probably we could make our own build of sqlite without significant problems
     * (both the C sqlite and JS better-sqlite projects are well documented)
     */
    copyFileSync(DB_STUB_FILE, DB_FILE);

    ({ closeServer, sqlite } = await initServer({
      sqliteConfig: {
        path: DB_FILE,
      },
      port: SERVER_PORT,
      envType: EnvType.TEST,
    }));

    Object.assign(Tester, testHelpers(sqlite));
  });

  beforeEach(() => {
    sqlite.prepare("BEGIN IMMEDIATE;").run();
  });

  afterEach(() => {
    sqlite.prepare("ROLLBACK").run();
  });

  afterAll(async () => {
    rmSync(DB_FILE);

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
