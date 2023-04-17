const TABLE_USERS = "users";

module.exports = (sqlite) => ({
  grabUser(userId) {
    const userFromDB = sqlite
      .prepare(`SELECT * FROM ${TABLE_USERS} WHERE id = ?`)
      .get(userId);
    userFromDB.movies_collection = JSON.parse(userFromDB.movies_collection);

    return userFromDB;
  },

  async haveUser(user) {
    const { id, firstName, lastName } = user;
    const moviesCollection = [];

    return sqlite
      .prepare(
        `INSERT INTO ${TABLE_USERS} (id, first_name, last_name, movies_collection) 
         VALUES (?, ?, ?, ?)`
      )
      .run(
        id || undefined,
        firstName || "john",
        lastName || "Mick",
        JSON.stringify(moviesCollection)
      );
  },

  async userHasCollection(userId, moviesCollection) {
    return sqlite
      .prepare(`UPDATE ${TABLE_USERS} SET movies_collection = ? WHERE id = ?`)
      .run(JSON.stringify(moviesCollection), userId);
  },
});
