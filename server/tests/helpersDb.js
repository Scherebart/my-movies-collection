const TABLE_USERS = "users";

module.exports = (sqlite) => ({
  grabUserById(userId) {
    const userFromDB = sqlite
      .prepare(`SELECT * FROM users WHERE id = ?`)
      .get(userId);

    return userFromDB;
  },
  grabUserByName(username) {
    const userFromDB = sqlite
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);

    return userFromDB
  },

  haveUser({ id, username, pass, first_name, last_name }) {
    return sqlite
      .prepare(
        `INSERT INTO users (id, username, pass, first_name, last_name, movies) 
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        id,
        username,
        pass,
        first_name,
        last_name,
        JSON.stringify([])
      );
  },

  userHasCollection(userId, moviesCollection) {
    return sqlite
      .prepare(`UPDATE users SET movies = ? WHERE id = ?`)
      .run(JSON.stringify(moviesCollection), userId);
  },
});
