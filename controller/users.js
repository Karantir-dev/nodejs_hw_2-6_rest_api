const UserSchema = require("../model/schemas/user.js");
const HttpCode = require("../helpers/constants.js");

const registration = async (req, res, next) => {
  const userExist = await UserSchema.findOne({ email: req.body.email });
  if (userExist) {
    return res.status(HttpCode.CONFLICT).json({
      status: `${HttpCode.CONFLICT} Conflict`,
      ContentType: "application/json",
      ResponseBody: {
        message: "Email in use",
      },
    });
  }
  try {
    const newUser = new UserSchema(req.body);
    await newUser.save();
    return res.status(HttpCode.CREATED).json({
      status: `${HttpCode.CREATED} Created`,
      ContentType: "application/json",
      ResponseBody: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registration };
