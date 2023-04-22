/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      first_name: "Anona",
      last_name: "Cruz",
      movies: '["tt0848228","tt4154756","tt2395427","tt4154796"]',
    },
    {
      id: 2,
      first_name: "Camilla",
      last_name: "Sayer",
      movies: "[]",
    },
    {
      id: 3,
      first_name: "Ganesh",
      last_name: "Zentai",
      movies:
        '["tt0287871","tt2975590","tt0103776","tt4116284","tt2313197"]',
    },
    {
      id: 4,
      first_name: "Vivien",
      last_name: "Straub",
      movies: '["tt0926084","tt0417741"]',
    },
    {
      id: 5,
      first_name: "Bernardita",
      last_name: "Bishop",
      movies: '["tt0389860"]',
    },
  ]);
};
