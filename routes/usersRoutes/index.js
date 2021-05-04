const express = require("express");
const router = express.Router();
const { registration } = require("../../controller/users.js");
const { validateCredentials } = require("./inputValidation.js");

router.post("/signUp", validateCredentials, registration);
router.post("/login");

module.exports = router;
