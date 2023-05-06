class UserError extends Error {}
class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

module.exports = {
  UserError,
  UnauthorizedError,
};
