const express = require("express");
const axios = require("axios");

const { ApplicationError, UnauthorizedError } = require("./errors");

module.exports = ({ apiKeyOmdb }) => {
  const omdbAxiosBase = axios.create({
    baseURL: "https://www.omdbapi.com/",
    method: "get",
    params: {
      apikey: apiKeyOmdb,
    },
  });

  const router = express.Router();

  router.use((req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    return next();
  });

  router.get("/my-movies-collection", async (req, res, next) => {
    const { user } = req;

    const { movies_collection } = user;

    return res.status(200).type("json").send(JSON.parse(movies_collection));
  });

  router.put("/my-movies-collection", async (req, res, next) => {
    const { db, user, body: newMoviesCollection } = req;

    db.prepare("UPDATE users SET movies_collection = ? WHERE id = ?").run(
      JSON.stringify(newMoviesCollection),
      user.id
    );

    return res.status(204).send();
  });

  router.get("/movie/:id", async (req, res, next) => {
    const { id } = req.params;

    const { status, data } = await omdbAxiosBase.request({ params: { i: id } });

    if (status != 200) {
      return next(
        new Error(`OMDB api responded with non 200 status (${status})`)
      );
    }

    if (data.Response === "False") {
      return res.sendStatus(404);
    }

    return res.status(status).type("json").send(data);
  });

  router.get("/movies", async (req, res, next) => {
    const {
      query: { terms },
    } = req;

    const { status, data } = await omdbAxiosBase.request({
      params: { s: terms },
    });

    if (status != 200) {
      return next(
        new Error(`OMDB api responded with non 200 status (${status})`)
      );
    }

    let result;
    if (data.Response === "False") {
      result = [];
    } else {
      result = data.Search;
    }

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
