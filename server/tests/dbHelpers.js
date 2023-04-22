const TABLE_USERS = "users";

module.exports = (sqlite) => ({
  grabUser(userId) {
    const userFromDB = sqlite
      .prepare(`SELECT * FROM ${TABLE_USERS} WHERE id = ?`)
      .get(userId);
    userFromDB.movies = JSON.parse(userFromDB.movies);

    return userFromDB;
  },

  haveUser(user) {
    const { id, firstName, lastName } = user;
    const moviesCollection = [];

    return sqlite
      .prepare(
        `INSERT INTO ${TABLE_USERS} (id, first_name, last_name, movies) 
         VALUES (?, ?, ?, ?)`
      )
      .run(
        id || undefined,
        firstName || "john",
        lastName || "Mick",
        JSON.stringify(moviesCollection)
      );
  },

  userHasCollection(userId, moviesCollection) {
    return sqlite
      .prepare(`UPDATE ${TABLE_USERS} SET movies = ? WHERE id = ?`)
      .run(JSON.stringify(moviesCollection), userId);
  },
});
