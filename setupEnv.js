const { randomBytes } = require("node:crypto");
const { writeFileSync, existsSync } = require("node:fs");
const path = require("path");

const { stringify: envObjectToString } = require("envfile");
const { exit } = require("node:process");

const envPath = path.join(__dirname, ".env");

if (existsSync(envPath)) {
  console.error("The .env file already exists");
  exit(1);
}

const SERVER_PRIVATE_KEY = randomBytes(16).toString("hex");
const OMDB_API_KEY = "";

const envObject = {
  SERVER_PRIVATE_KEY,
  OMDB_API_KEY,
};
writeFileSync(envPath, envObjectToString(envObject));
