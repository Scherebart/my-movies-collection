const nock = require("nock");

module.exports = (apiKeyOmdb) => ({
  willGetMovie(id, data) {
    nock("https://www.omdbapi.com")
      .get("/")
      .query({ apikey: apiKeyOmdb, i: id })
      .reply(200, data);
  },

  willGetNothing(id) {
    nock("https://www.omdbapi.com")
      .get("/")
      .query({ apikey: apiKeyOmdb, i: id })
      .reply(200, {
        Response: "False",
        Error: "Incorrect IMDb ID.",
      });
  },

  willSearchWith(phrase, searchResults) {
    if (searchResults.length === 0) {
      return nock("https://www.omdbapi.com")
        .get("/")
        .query({ apikey: apiKeyOmdb, s: phrase })
        .reply(200, {
          Response: "False",
          Error: "Movie not found!",
        });
    }

    nock("https://www.omdbapi.com")
      .get("/")
      .query({ apikey: apiKeyOmdb, s: phrase })
      .reply(200, { Search: searchResults });
  },
});
