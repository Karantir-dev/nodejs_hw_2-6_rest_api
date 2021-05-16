const express = require("express");
const router = express.Router();
const {
  registration,
  login,
  logout,
  getCurrentUser,
  updateSubscr,
  updateAvatar,
  verifyEmail,
  repeatEmailVerification,
} = require("../../controller/users.js");
const {
  validateCredentials,
  validateSubscription,
} = require("./credentialsValidation.js");
const guard = require("../../helpers/guard");
const uploadAvatar = require("../../helpers/upload-avatar");

router.post("/signUp", validateCredentials, registration);
router.post("/login", validateCredentials, login);
router.post("/logout", guard, logout);
router.get("/current", guard, getCurrentUser);
router.patch("/", guard, validateSubscription, updateSubscr);
router.patch("/avatars", guard, uploadAvatar.single("avatar"), updateAvatar);

router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", repeatEmailVerification);

module.exports = router;
