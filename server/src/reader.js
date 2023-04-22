const axios = require("axios");

module.exports = ({ apiKeyOmdb }) => {
  const omdbAxiosBase = axios.create({
    baseURL: "https://www.omdbapi.com/",
    method: "get",
    params: {
      apikey: apiKeyOmdb,
    },
  });

  return {
    getUserMovies(user) {
      const { movies } = user;

      return JSON.parse(movies);
    },
    async getMovie(id) {
      const { status, data } = await omdbAxiosBase.request({
        params: { i: id },
      });

      if (status != 200) {
        throw new Error(`OMDB api responded with non 200 status (${status})`);
      }

      if (data.Response === "False") {
        return null;
      }

      return data;
    },
    async searchMovies(terms) {
      const { status, data } = await omdbAxiosBase.request({
        params: { s: terms },
      });

      if (status != 200) {
        throw new Error(`OMDB api responded with non 200 status (${status})`);
      }

      if (data.Response === "False") {
        return [];
      } else {
        return data.Search;
      }
    },
  };
};
