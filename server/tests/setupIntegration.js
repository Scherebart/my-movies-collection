const path = require("path");
const { copyFileSync, rmSync } = require("node:fs");

const nock = require("nock");
const { v4: uuid } = require("uuid");

const connectToSqlite = require("../src/connectToSqlite");
const dbHelpers = require("./helpersDb");
const omdbApiHelpers = require("./helpersOmdb");

const TESTS_ROOT_PATH = __dirname;
const DB_STUB_FILE = path.join(TESTS_ROOT_PATH, ".db", "db-STUB.sqlite3");
const DB_FILE = path.join(TESTS_ROOT_PATH, ".db", `db-test-${uuid()}.sqlite3`);
const API_KEY_OMDB = "xxx";

module.exports = () => {
  const sqlite = connectToSqlite({ path: DB_FILE });
  const db = {};
  const omdbApi = {};

  beforeAll(async () => {
    // see a comment on this in the setupFunctional.js
    copyFileSync(DB_STUB_FILE, DB_FILE);
    Object.assign(db, dbHelpers(sqlite));

    Object.assign(omdbApi, omdbApiHelpers(API_KEY_OMDB));
  });

  beforeEach(() => {
    // go to the functional/setup.js to see a comment on this
    nock("https://www.omdbapi.com").get("/").reply(500);

    sqlite.prepare("BEGIN IMMEDIATE;").run();
  });

  afterEach(() => {
    nock.cleanAll();
    sqlite.prepare("ROLLBACK").run();
  });

  afterAll(async () => {
    rmSync(DB_FILE);
  });

  return {
    sqlite,
    db,
    omdbApi,
  };
};
