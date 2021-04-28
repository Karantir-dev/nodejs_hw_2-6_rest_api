const Joi = require("joi");

const schemaPostPut = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().optional(),
});

const schemaPatch = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  favorite: Joi.boolean().optional(),
}).or("name", "email", "phone", "favorite");

module.exports = {
  validatePatch: async (req, res, next) => {
    try {
      await schemaPatch.validateAsync(req.body);
      return next();
    } catch (err) {
      next({ status: "error", code: 400, message: err.message });
    }
  },
  validatePostPut: async (req, res, next) => {
    try {
      await schemaPostPut.validateAsync(req.body);
      return next();
    } catch (err) {
      next({
        status: "error",
        code: 400,
        message: err.message.replace(/"/g, "'"),
      });
    }
  },
};
