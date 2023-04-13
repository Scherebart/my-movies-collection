class ApplicationError extends Error {}
class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

module.exports = {
  ApplicationError,
  UnauthorizedError,
};
