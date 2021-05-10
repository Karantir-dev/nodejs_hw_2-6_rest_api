const UserSchema = require('../model/schemas/user.js');
const HttpCode = require('../helpers/constants.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');

const registration = async (req, res, next) => {
  const userExist = await UserSchema.findOne({ email: req.body.email });
  if (userExist) {
    return res.status(HttpCode.CONFLICT).json({
      status: `${HttpCode.CONFLICT} Conflict`,
      ContentType: 'application/json',
      ResponseBody: {
        message: 'Email in use',
      },
    });
  }
  try {
    const newUser = new UserSchema(req.body);
    await newUser.save();
    return res.status(HttpCode.CREATED).json({
      status: `${HttpCode.CREATED} Created`,
      ContentType: 'application/json',
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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await UserSchema.findOne({ email });
    const isValidPassword = await foundUser?.isValidPassword(password);
    if (!foundUser || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        Status: `${HttpCode.UNAUTHORIZED} Unauthorized`,
        ResponseBody: {
          message: 'Email or password is wrong',
        },
      });
    }

    const payload = { id: foundUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '2h',
    });
    await UserSchema.updateOne({ _id: foundUser.id }, { token });

    return res.status(HttpCode.OK).json({
      Status: `${HttpCode.OK} OK`,
      ContentType: 'application/json',
      ResponseBody: {
        token,
        user: {
          email: foundUser.email,
          subscription: foundUser.subscription,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  const userId = req.user?.id;
  await UserSchema.updateOne({ _id: userId }, { token: null });
  return res.status(HttpCode.NO_CONTENT).json({
    Status: `${HttpCode.NO_CONTENT} No Content`,
  });
};

const getCurrentUser = async (req, res, next) => {
  return res.status(HttpCode.OK).json({
    Status: `${HttpCode.OK} OK`,
    ContentType: 'application/json',
    ResponseBody: {
      email: req.user.email,
      subscription: req.user.subscription,
    },
  });
};

const updateSubscr = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const updatedUser = await UserSchema.findOneAndUpdate(
      { _id: userId },
      { subscription: req.body.subscription },
      { new: true }
    );

    return res.status(HttpCode.OK).json({
      Status: `${HttpCode.OK} OK`,
      ContentType: 'application/json',
      ResponseBody: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  try {
    const avatarURL = await saveUserAvatar(req);
    await UserSchema.updateOne({ _id: id }, { avatarURL });

    return res.status(HttpCode.OK).json({
      Status: `${HttpCode.OK} OK`,
      ContentType: 'application/json',
      ResponseBody: {
        avatarURL: avatarURL,
      },
    });
  } catch (err) {
    console.log(err.message);
  }
};

const saveUserAvatar = async (req) => {
  const filePath = req.file.path;

  const newAvatarName = `${Date.now().toString()}-${req.file.originalname}`;
  await jimp
    .read(filePath)
    .then((img) => {
      img
        .autocrop()
        .cover(
          250,
          250,
          jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
        )
        .write(filePath);
    })
    .catch((err) => console.log(err.message));

  await fs.rename(
    filePath,
    path.join(process.cwd(), 'public/avatars', newAvatarName)
  );

  const oldAvatarURL = req.user.avatarURL;
  if (oldAvatarURL.includes('avatars/')) {
    await fs.unlink(path.join(process.cwd(), 'public', oldAvatarURL));
  }

  return path.join('avatars', newAvatarName).replace('\\', '/');
};

module.exports = {
  registration,
  login,
  logout,
  getCurrentUser,
  updateSubscr,
  updateAvatar,
};
