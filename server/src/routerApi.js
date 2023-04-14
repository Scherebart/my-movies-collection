const express = require("express");
const router = express.Router();

const { TABLE_USERS } = require("./constants");
const { ApplicationError, UnauthorizedError } = require("./errors");

router.use((req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  return next();
});

router.get("/my-movies-collection", async (req, res, next) => {
  const { knex, user } = req;

  const { movies_collection } = user;

  return res.status(200).type("json").send(JSON.parse(movies_collection));
});

router.put("/my-movies-collection", async (req, res, next) => {
  const { knex, user, body: newMoviesCollection } = req;

  await knex(TABLE_USERS)
    .where({ id: user.id })
    .update({ movies_collection: JSON.stringify(newMoviesCollection) });

  return res.status(204).send();
});

router.use((err, req, res, next) => {
  if (err) {
    res.type("json");

    if (err instanceof ApplicationError) {
      return res.status(400).send({ error: err.message });
    } else if (err instanceof UnauthorizedError) {
      return res.status(401).send({ error: "Unauthorized" });
    } else {
      console.error(err);
      return res.status(500).send({ error: "Unexpected error occured" });
    }
  }
});

module.exports = router;
