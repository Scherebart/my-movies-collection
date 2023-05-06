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
    async getUserMovies(user) {
      const { movies } = user;

      return Promise.all(
        movies.map(async (id) => {
          const { status, data } = await omdbAxiosBase.request({
            params: { i: id },
          });

          if (status != 200 || data.Response === "False") {
            return null;
          }

          const { imdbID, Title, Year, Plot, Poster } = data;
          
          return {
            imdbID,
            Title,
            Year,
            Plot,
            Poster: Poster && Poster.indexOf("http") === 0 ? Poster : null,
          };
        })
      );
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
        return data.Search.map(({ imdbID, Title, Year, Poster }) => ({
          imdbID,
          Title,
          Year,
          Poster: Poster && Poster.indexOf("http") === 0 ? Poster : null,
        }));
      }
    },
  };
};
