const express = require("express");
const router = express.Router();
const {
  getAll,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../controller/contacts.js");
const { validatePatch, validatePostPut } = require("./inputValidation.js");

router.get("/", getAll);

router.get("/:contactId", getContactById);

router.post("/", validatePostPut, addContact);

router.put("/:contactId", validatePostPut, updateContact);

router.delete("/:contactId", removeContact);

router.patch("/:contactId", validatePatch, updateContact);

module.exports = router;
