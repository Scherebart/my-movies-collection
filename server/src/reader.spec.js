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

describe("I can get details of existing movie", () => {
  test("Missing poster is given as null", async () => {
    omdbApi.willGetMovie("tt1285016", {
      imdbID: "tt1285016",
      // I don't expect the Poster field to be always present
    });
    omdbApi.willGetMovie("tt0101889", {
      imdbID: "tt0101889",
      Poster: "N/A",
    });
    omdbApi.willGetMovie("tt010111", {
      imdbID: "tt010111",
      Poster: "http://picresource",
    });

    const movies = await Promise.all([
      getMovie("tt1285016"),
      getMovie("tt0101889"),
      getMovie("tt010111"),
    ]);

    expect(movies).toMatchObject([
      { imdbID: "tt1285016", Poster: null },
      { imdbID: "tt0101889", Poster: null },
      { imdbID: "tt010111", Poster: "http://picresource" },
    ]);
  });
});

describe("can get user's favourite movies", () => {
  test("Missing poster is given as null", async () => {
    db.userHasCollection(USER_ID, ["tt1285016", "tt0101889", "tt010111"]);
    const user = db.grabUser(USER_ID);
    omdbApi.willGetMovie("tt1285016", {
      imdbID: "tt1285016",
      // I don't expect the Poster field to be always present
    });
    omdbApi.willGetMovie("tt0101889", {
      imdbID: "tt0101889",
      Poster: "N/A",
    });
    omdbApi.willGetMovie("tt010111", {
      imdbID: "tt010111",
      Poster: "http://picresource",
    });

    const userMovies = await getUserMovies(user);

    expect(userMovies).toMatchObject([
      { imdbID: "tt1285016", Poster: null },
      { imdbID: "tt0101889", Poster: null },
      { imdbID: "tt010111", Poster: "http://picresource" },
    ]);
  });
});

describe("can search for movies", () => {
  test("Missing poster is given as null", async () => {
    omdbApi.willSearchWith("love", [
      {
        imdbID: "tt1",
        // I don't expect the Poster field to be always present
      },
      {
        imdbID: "tt2",
        Poster: "N/A",
      },
      {
        imdbID: "tt3",
        Poster: "http://picresource",
      },
    ]);

    const result = await searchMovies("love");

    expect(result).toMatchObject([
      {
        imdbID: "tt1",
        Poster: null,
      },
      {
        imdbID: "tt2",
        Poster: null,
      },
      {
        imdbID: "tt3",
        Poster: "http://picresource",
      },
    ]);
  });
});
