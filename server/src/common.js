const { UserError } = require("./errors");

const validate = (data, schema) => {
  const { error, value } = schema.validate(data, { abortEarly: true });
  if (error) {
    throw new UserError(error.details[0].message);
  }

  return value;
};

module.exports = { validate };
