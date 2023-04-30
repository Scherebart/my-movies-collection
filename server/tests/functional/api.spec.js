const setupFunctional = require("../setupFunctional");

const { asUser, asGuest, db, omdbApi } = setupFunctional();

const NONEXISTENT_USER_ID = 0;
const USER_ID = 4;
const ANOTHER_USER_ID = 5;

describe("As a user", () => {
  beforeEach(() => {
    db.haveUser({ id: USER_ID, firstName: "Emma", lastName: "McCormick" });
  });

  test("I get data about myself", async () => {
    db.haveUser({ id: ANOTHER_USER_ID, firstName: "Rob", lastName: "Runner" });
    
    const { status, data } = await asUser(ANOTHER_USER_ID).request({
      method: "GET",
      url: "/api/me",
    });

    expect(status).toBe(200);
    expect(data).toEqual({
      id: ANOTHER_USER_ID,
      firstName: "Rob",
      lastName: "Runner",
    });
  });

  test("I get my favourite movies", async () => {
    db.userHasCollection(USER_ID, ["tt1285016", "tt0101889"]);
    omdbApi.willGetMovie("tt1285016", {
      Title: "The Social Network",
      Year: "2010",
    });
    omdbApi.willGetMovie("tt0101889", {
      Title: "The Fisher King",
      Year: "1991",
    });

    const { status, data } = await asUser(USER_ID).request({
      method: "GET",
      url: "/api/my-movies",
    });

    expect(status).toBe(200);
    expect(data).toEqual([
      { Title: "The Social Network", Year: "2010" },
      { Title: "The Fisher King", Year: "1991" },
    ]);
  });

  test("I get empty collection when I have no favourite movies", async () => {
    const { status, data } = await asUser(USER_ID).request({
      method: "GET",
      url: "/api/my-movies",
    });

    expect(status).toBe(200);
    expect(data).toEqual([]);
  });

  test("I can set favourite movies", async () => {
    db.haveUser({ id: ANOTHER_USER_ID });
    db.userHasCollection(USER_ID, ["qwe", "321"]);

    const { status } = await asUser(USER_ID).request({
      method: "PUT",
      url: "/api/my-movies",
      data: ["321", "asd"],
    });

    expect(status).toBe(204);

    const userFromDb = await db.grabUser(USER_ID);
    expect(userFromDb).toMatchObject({
      movies: ["321", "asd"],
    });
  });

  test("I get 404 on calling non-existent api method", async () => {
    const { status } = await asUser(USER_ID).request({
      method: "GET",
      url: "/api/non-existent-feature",
    });

    expect(status).toBe(404);
  });

  test("I can get details of existing movie", async () => {
    omdbApi.willGetMovie("tt1285016", {
      Title: "The Social Network",
      Year: "2010",
    });

    const { status, data } = await asUser(USER_ID).request({
      method: "GET",
      url: "/api/movies/tt1285016",
    });

    expect(status).toBe(200);
    expect(data).toEqual({
      Title: "The Social Network",
      Year: "2010",
    });
  });

  test("I get 404 on nonexistent movie", async () => {
    omdbApi.willGetNothing("tt1285016");

    const { status } = await asUser(USER_ID).request({
      method: "GET",
      url: "/api/movies/tt1285016",
    });

    expect(status).toBe(404);
  });

  test("I can search for movies", async () => {
    omdbApi.willSearchWith("love crazy", [
      {
        imdbID: 'tt1',
        Title: "Crazy, Stupid, Love.",
        Year: "2011",
        Poster: 'http://resource1'
      },
      {
        imdbID: 'tt2',
        Title: "Love Crazy",
        Year: "1941",
        Poster: 'http://resource2'
      },
    ]);

    const { status, data } = await asUser(USER_ID).request({
      method: "GET",
      url: `/api/movies`,
      params: {
        terms: "love crazy",
      },
    });

    expect(status).toBe(200);
    expect(data).toEqual([
      {
        imdbID: 'tt1',
        Title: "Crazy, Stupid, Love.",
        Year: "2011",
        Poster: 'http://resource1'
      },
      {
        imdbID: 'tt2',
        Title: "Love Crazy",
        Year: "1941",
        Poster: 'http://resource2'
      },
    ]);
  });

  test("I can search for no movies", async () => {
    omdbApi.willSearchWith("love", []);

    const { status, data } = await asUser(USER_ID).request({
      method: "GET",
      url: `/api/movies`,
      params: {
        terms: "love",
      },
    });

    expect(status).toBe(200);
    expect(data).toEqual([]);
  });
});

describe("As a non-existent user", () => {
  test("I get 401 on calling api method", async () => {
    db.haveUser({ id: USER_ID });
    db.haveUser({ id: ANOTHER_USER_ID });

    const { status } = await asUser(NONEXISTENT_USER_ID).request({
      method: "GET",
      url: "/api/my-movies",
    });

    expect(status).toBe(401);
  });

  test("I get 401 on calling non-existent api method", async () => {
    const { status } = await asUser(NONEXISTENT_USER_ID).request({
      method: "GET",
      url: "/api/non-existent-feature",
    });

    expect(status).toBe(401);
  });
});

describe("As a guest", () => {
  test("I get 401 on calling api method", async () => {
    const { status } = await asGuest().request({
      method: "GET",
      url: "/api/my-movies",
    });

    expect(status).toBe(401);
  });

  test("I get 401 on calling nonexistent api method", async () => {
    const { status } = await asGuest().request({
      method: "GET",
      url: "/api/non-existent-feature",
    });

    expect(status).toBe(401);
  });
});
