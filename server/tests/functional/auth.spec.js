const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const setupFunctional = require("../setupFunctional");

const { asUser, asGuest, db, omdbApi } = setupFunctional({
  serverPrivateKey: "key123",
});

const USER_ID = 1;
const ANOTHER_USER_ID = 2;

beforeEach(() => {
  db.haveUser({ id: ANOTHER_USER_ID, username: "emma" });
});

describe("register", () => {
  test("Guest can register", async () => {
    const { status } = await asGuest().request({
      method: "POST",
      url: "/auth/register",
      data: {
        username: "rob",
        firstName: "Rob",
        lastName: "Runner",
        password: "pass123",
      },
    });

    expect(status).toBe(204);

    const userFromDb = db.grabUserByName("rob");
    expect(userFromDb).toMatchObject({
      username: "rob",
      pass: expect.any(String),
      first_name: "Rob",
      last_name: "Runner",
      movies: "[]",
    });
    expect(bcrypt.compareSync("pass123", userFromDb.pass)).toBeTruthy();
  });

  test("Password min length is required", async () => {
    const { status, data } = await asGuest().request({
      method: "POST",
      url: "/auth/register",
      data: {
        username: "rob",
        password: "pass",
      },
    });

    expect(status).toBe(400);
    expect(data).toEqual({
      error: '"password" length must be at least 6 characters long',
    });
  });
});

describe("login", () => {
  beforeEach(() => {
    db.haveUser({
      id: USER_ID,
      username: "rob",
      pass: bcrypt.hashSync("pass123", 1),
    });
  });

  test("Guest can login", async () => {
    const { status, data } = await asGuest().request({
      method: "POST",
      url: "/auth/login",
      data: {
        username: "rob",
        password: "pass123",
      },
    });

    expect(status).toBe(200);
    expect(data).toEqual({ token: expect.any(String) });
    expect(jwt.verify(data.token, "key123")).toMatchObject({
      id: USER_ID,
      username: "rob",
    });
  });

  test("Get 401 on bad password", async () => {
    const { status, data } = await asGuest().request({
      method: "POST",
      url: "/auth/login",
      data: {
        username: "rob",
        password: "pass321",
      },
    });

    expect(status).toBe(401);
    expect(data).toEqual({ error: "Wrong username or password" });
  });

  test("Get 401 on non-existent username", async () => {
    const { status, data } = await asGuest().request({
      method: "POST",
      url: "/auth/login",
      data: {
        username: "robbie",
        password: "pass123",
      },
    });

    expect(status).toBe(401);
    expect(data).toEqual({ error: "Wrong username or password" });
  });
});
