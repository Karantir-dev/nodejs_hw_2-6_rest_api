const express = require("express");
const router = express.Router();
const {
  registration,
  login,
  logout,
  getCurrentUser,
  updateSubscr,
} = require("../../controller/users.js");
const {
  validateCredentials,
  validateSubscription,
} = require("./credentialsValidation.js");
const guard = require("../../helpers/guard");

router.post("/signUp", validateCredentials, registration);
router.post("/login", validateCredentials, login);
router.post("/logout", guard, logout);
router.get("/current", guard, getCurrentUser);
router.patch("/", guard, validateSubscription, updateSubscr);

module.exports = router;
