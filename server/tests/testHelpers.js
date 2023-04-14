const TABLE_USERS = "users";

module.exports = (db) => ({
  async grabUser(userId) {
    const userFromDB = await db(TABLE_USERS).where({ id: userId }).first();
    userFromDB.movies_collection = JSON.parse( userFromDB.movies_collection)

    return userFromDB
  },

  async haveUser(user) {
    const { id, firstName, lastName } = user;
    const moviesCollection = [];

    return db(TABLE_USERS).insert({
      id: id || undefined,
      first_name: firstName || "john",
      last_name: lastName || "Mick",
      movies_collection: JSON.stringify(moviesCollection),
    });
  },

  async userHasCollection(userId, moviesCollection) {
    return db(TABLE_USERS)
      .where({ id: userId })
      .update({ movies_collection: JSON.stringify(moviesCollection) });
  },
});
