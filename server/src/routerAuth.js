const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const { validate } = require("./common");
const { UserError, UnauthorizedError } = require("./errors");

const hashPassword = async (password) => bcrypt.hash(password, 10);
const verifyPassword = async (password, expectedHash) =>
  bcrypt.compare(password, expectedHash);
const createToken = (privateKey, user) =>
  jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    privateKey,
    { algorithm: "HS256", expiresIn: "5m" }
  );

module.exports = ({ privateKey }) => {
  const router = express.Router();

  const joiRegisterSchema = joi.object({
    username: joi.string().trim().required(),
    password: joi.string().min(6).required(),
    firstName: joi.string().trim().normalize(),
    lastName: joi.string().trim().normalize(),
  });

  const joiLoginSchema = joi.object({
    username: joi.string().trim().required(),
    password: joi.string().required(),
  });

  router.post("/register", async (req, res) => {
    const { sqlite, body } = req;

    const { username, password, firstName, lastName } = validate(
      body,
      joiRegisterSchema
    );

    userFromDb = sqlite
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);
    if (userFromDb) {
      throw new UserError(`Username '${username}' is already taken!`);
    }

    sqlite
      .prepare(
        "INSERT INTO users (username, pass, first_name, last_name, movies) VALUES (?, ?, ?, ?, ?)"
      )
      .run(username, await hashPassword(password), firstName, lastName, "[]");

    return res.status(204).send();
  });

  router.post("/login", async (req, res) => {
    const { sqlite, body } = req;

    const { username, password } = validate(body, joiLoginSchema);

    const user = sqlite
      .prepare("SELECT id, username, pass FROM users WHERE username = ?")
      .get(username);
    if (!user || !(await verifyPassword(password, user.pass))) {
      throw new UnauthorizedError('Wrong username or password');
    }

    return res.status(200).send({ token: createToken(privateKey, user) });
  });

  return router;
};
