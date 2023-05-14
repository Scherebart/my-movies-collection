class UserError extends Error {}
class UnauthorizedError extends Error {
  constructor(message) {
    super(message || "Unauthorized");
  }
}

module.exports = {
  UserError,
  UnauthorizedError,
};
