const express = require("express");
const axios = require("axios");

const { ApplicationError, UnauthorizedError } = require("./errors");
const reader = require("./reader");

module.exports = ({ apiKeyOmdb }) => {
  const { getUserMovies, getMovie, searchMovies } = reader({ apiKeyOmdb });

  const router = express.Router();

  router.use((req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    return next();
  });

  router.get("/me", (req, res) => {
    const {
      user: { id, first_name, last_name },
    } = req;
    const me = {
      id,
      firstName: first_name,
      lastName: last_name,
    };

    return res.status(200).send(me);
  });

  router.get("/my-movies", async (req, res, next) => {
    const { user } = req;

    const movies = await getUserMovies(user);

    return res.status(200).type("json").send(movies);
  });

  router.put("/my-movies", async (req, res, next) => {
    const { sqlite, user, body: newMoviesCollection } = req;

    sqlite
      .prepare("UPDATE users SET movies = ? WHERE id = ?")
      .run(JSON.stringify(newMoviesCollection), user.id);

    return res.status(204).send();
  });

  router.get("/movies/:id", async (req, res, next) => {
    const { id } = req.params;

    const movie = await getMovie(id);

    if (movie === null) {
      return res.sendStatus(404);
    }

    return res.status(200).type("json").send(movie);
  });

  router.get("/movies", async (req, res, next) => {
    const {
      query: { terms },
    } = req;

    const result = await searchMovies(terms);

    return res.status(200).type("json").send(result);
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

  return router;
};
