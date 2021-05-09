const Joi = require("joi");
const HttpCode = require("../../helpers/constants.js");

const schemaCredentials = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
});

const schemaSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").optional(),
});

module.exports = {
  validateCredentials: async (req, res, next) => {
    try {
      await schemaCredentials.validateAsync(req.body);
      return next();
    } catch (err) {
      next({
        status: "Bad Request",
        code: HttpCode.BAD_REQUEST,
        contentType: "application/json",
        message: err.message.replace(/"/g, "'"),
      });
    }
  },
  validateSubscription: async (req, res, next) => {
    try {
      await schemaSubscription.validateAsync(req.body);
      return next();
    } catch (err) {
      next({
        status: "Bad Request",
        code: HttpCode.BAD_REQUEST,
        contentType: "application/json",
        message: err.message.replace(/"/g, "'"),
      });
    }
  },
};
