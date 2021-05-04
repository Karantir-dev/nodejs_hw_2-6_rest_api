const User = require("./schemas/user.js");

const createUser = async (userOptions) => {
  const user = new User(userOptions);
  return await user.save();
};

module.exports = { createUser };
