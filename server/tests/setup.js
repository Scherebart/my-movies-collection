const path = require("path");
const { copyFileSync, rmSync } = require("node:fs");

const nock = require("nock");
const axios = jest.requireActual("axios");
const { v4: uuid } = require("uuid");

const initServer = require("../src/initServer");
const { EnvType } = require("../../constants");
const dbHelpers = require("./dbHelpers");
const omdbApiHelpers = require("./omdbApiHelpers");

const DB_STUB_FILE = path.join(__dirname, ".db", "db-STUB.sqlite3");
const DB_FILE = path.join(__dirname, ".db", `db-test-${uuid()}.sqlite3`);
const SERVER_PORT = 8081;
const API_KEY_OMDB = "3b98b3f0";

function functional() {
  let closeServer;
  let sqlite;

  const db = {};
  const omdbApi = {};

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
     * which build is included by better-sqlite3.
     * Possibly we could make our own build of sqlite without significant problems
     * (both the C sqlite and JS better-sqlite projects are well documented)
     */
    copyFileSync(DB_STUB_FILE, DB_FILE);


    Object.assign(omdbApi, omdbApiHelpers(API_KEY_OMDB));

    ({ closeServer, sqlite } = await initServer({
      sqliteConfig: {
        path: DB_FILE,
      },
      apiKeyOmdb: API_KEY_OMDB,
      port: SERVER_PORT,
      envType: EnvType.TEST,
    }));

    Object.assign(db, dbHelpers(sqlite));
  });

  beforeEach(() => {
    // This line makes the nock intercept calls to the omdbapi host
    // Without committing any configuration, nock is effectively absent for that host,
    // and all calls go to the real host
    nock("https://www.omdbapi.com").get("/").reply(500);

    sqlite.prepare("BEGIN IMMEDIATE;").run();
  });

  afterEach(() => {
    nock.cleanAll();
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
    db,
    omdbApi,
  };
}

module.exports = {
  functional,
};
