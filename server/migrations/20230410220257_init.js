/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  const query = knex.schema.createTable("users", function (table) {
    table.increments("id").primary()
    table.string('first_name')
    table.string('last_name')
    table.text('movies')
  });

  return query
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
