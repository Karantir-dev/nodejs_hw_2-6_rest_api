const User = require("./data");

const dbUpdateAvatar = (id, avatarURL) => {
  User.avatarURL = avatarURL;
};

const findUser = (id) => {
  return User;
};

module.exports = { dbUpdateAvatar, findUser };
