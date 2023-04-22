const Database = require("better-sqlite3");

module.exports = (config) => {
  const { path } = config;
  /**
   * TODO: add logging function respecting desired log level  
   * Example: no logging during tests except when debugging - 
   * I could run jest then with special env param to switch these logs on  
   **/ 
  const db = new Database(path, { verbose: null /* console.log*/ });
  db.pragma("journal_mode = delete");

  return db;
};
