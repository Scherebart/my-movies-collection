const express = require("express");
const axios = require("axios");

const { UserError, UnauthorizedError } = require("./errors");
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
    const { user } = req;

    const {username, firstName, lastName, movies} = user

    return res.status(200).type("json").send({username, firstName, lastName, movies});
  });

  router.get("/my-movies", async (req, res, next) => {
    const { sqlite, user } = req;

    const movies = await getUserMovies(sqlite, user.id);

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

  return router;
};
