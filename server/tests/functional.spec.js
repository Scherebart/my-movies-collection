const { functional } = require("./setup");

const { asUser, asGuest, Tester } = functional();

const USER_ID = 4;
const ANOTHER_USER_ID = 5;

describe("As a user", () => {
  test("I get my favourite movies", async () => {
    await Tester.haveUser({ id: USER_ID });
    await Tester.haveUser({ id: ANOTHER_USER_ID });
    await Tester.userHasCollection(USER_ID, ["qwe", "321"]);

    const { status, data } = await asUser(USER_ID).request({
      method: "GET",
      url: "/api/my-movies-collection",
    });

    expect(status).toBe(200);
    expect(data).toEqual(["qwe", "321"]);
  });

  test("I get empty collection when I have no favourite movies", async ()=>{
    await Tester.haveUser({ id: USER_ID });

    const { status, data } = await asUser(USER_ID).request({
      method: "GET",
      url: "/api/my-movies-collection",
    });

    expect(status).toBe(200);
    expect(data).toEqual([]);
  });
});

describe("As a guest",()=>{

  test("I get 401 on calling api method", async () => {
    const { status } = await asGuest().request({
      method: "GET",
      url: "/api/my-movies-collection",
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
})
