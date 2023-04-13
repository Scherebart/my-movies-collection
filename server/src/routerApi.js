const express = require("express");
const router = express.Router();

const { ApplicationError, UnauthorizedError } = require("./errors");

router.use((req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  return next();
});

router.get("/my-movies-collection", async (req, res, next) => {
  const { knexBuilder, user } = req;
  const userFromDb = await knexBuilder
    .from("users")
    .where({ id: user.id })
    .first();
  if (!userFromDb) {
    return next(new ApplicationError(`no such user ${user.id}`));
  }

  const { movies_collection } = userFromDb;

  return res.status(200).type("json").send(JSON.parse(movies_collection));
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
