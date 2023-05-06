const TABLE_USERS = "users";

module.exports = (sqlite) => ({
  grabUser(userId) {
    const userFromDB = sqlite
      .prepare(`SELECT * FROM users WHERE id = ?`)
      .get(userId);
    userFromDB.movies = JSON.parse(userFromDB.movies);

    return userFromDB;
  },

  haveUser({ id, firstName, lastName }) {
    const moviesCollection = [];
    
    return sqlite
      .prepare(
        `INSERT INTO users (id, first_name, last_name, movies) 
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
      .prepare(`UPDATE users SET movies = ? WHERE id = ?`)
      .run(JSON.stringify(moviesCollection), userId);
  },
});
