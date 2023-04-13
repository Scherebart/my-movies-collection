const knex = require("knex");

/**
 * Returns Knex functions for communicating with the Sqlite DB
 */
module.exports = async (knexConfig) => {
  const connection = await knex(knexConfig);

  return {
    getKnex() {
      return connection;
    },
    async destroy() {
      await connection.destroy();
    },
  };
};
