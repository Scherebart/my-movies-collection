const reader = require("./reader");
const setupIntegration = require("../tests/setupIntegration");

const { db, omdbApi } = setupIntegration();

const API_KEY_OMDB = "xxx";
const USER_ID = 4;

let getUserMovies, getMovie, searchMovies;
beforeAll(() => {
  ({ getUserMovies, getMovie, searchMovies } = reader({
    apiKeyOmdb: API_KEY_OMDB,
  }));
});

beforeEach(() => {
  db.haveUser({ id: USER_ID, firstName: "Emma", lastName: "McCormick" });
});

describe("can search for movies", () => {
  test("Missing poster is given as null", async () => {
    omdbApi.willSearchWith("love", [
      {
        imdbID: 'tt1',
        // I don't expect the Poster field to be always present
      },
      {
        imdbID: 'tt2',
        Poster: "N/A"
      },
      {
        imdbID: 'tt3',
        Poster: "http://picresource"
      },
    ]);

    const result = await searchMovies("love");

    expect(result).toMatchObject([
      {
        imdbID: 'tt1',
        Poster: null
      },
      {
        imdbID: 'tt2',
        Poster: null
      },
      {
        imdbID: 'tt3',
        Poster: "http://picresource"
      },
    ]);
  });
});
