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
      username: 'anona',
      first_name: "Anona",
      last_name: "Cruz",
      movies: '["tt0848228","tt4154756","tt2395427","tt4154796"]',
    },
    {
      id: 2,
      username: 'camilla',
      first_name: "Camilla",
      last_name: "Sayer",
      movies: "[]",
    },
    {
      id: 3,
      username: 'ganesh',
      first_name: "Ganesh",
      last_name: "Zentai",
      movies:
        '["tt0287871","tt2975590","tt0103776","tt4116284","tt2313197"]',
    },
    {
      id: 4,
      username: 'vivien',
      // password: test123
      pass: '$2b$10$HHHndHSOScdxgkcE/MIYBe8ThNZWyPd8aRezz7jse88kQRG1uPnCq',
      first_name: "Vivien",
      last_name: "Straub",
      movies: '["tt0926084","tt0417741"]',
    },
    {
      id: 5,
      username: 'berna',
      // password: test123
      pass: '$2b$10$HHHndHSOScdxgkcE/MIYBe8ThNZWyPd8aRezz7jse88kQRG1uPnCq',
      first_name: "Bernardita",
      last_name: "Bishop",
      movies: '["tt0389860"]',
    },
  ]);
};
