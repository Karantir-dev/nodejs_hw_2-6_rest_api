const Joi = require("joi");
const HttpCode = require("../../helpers/constants.js");

const schemaCredentials = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
});
const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
});

module.exports = {
  validateCredentials: async (req, res, next) => {
    try {
      await schemaCredentials.validateAsync(req.body);
      return next();
    } catch (err) {
      console.log(HttpCode.BAD_REQUEST);
      next({
        status: "Bad Request",
        code: HttpCode.BAD_REQUEST,
        contentType: "application/json",
        message: err.message.replace(/"/g, "'"),
      });
    }
  },
};
