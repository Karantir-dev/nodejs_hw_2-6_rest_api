const UserSchema = require("./schemas/user.js");

const dbUpdateAvatar = async (id, avatarURL) => {
  return await UserSchema.updateOne({ _id: id }, { avatarURL });
};

const findUser = async (id) => {
  return await UserSchema.findOne({ _id: id });
};

module.exports = { dbUpdateAvatar, findUser };
