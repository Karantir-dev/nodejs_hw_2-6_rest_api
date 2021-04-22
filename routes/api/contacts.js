const express = require("express");
const router = express.Router();
const contacts = require("../../model/index.js");
const { validatePatch, validatePostPut } = require("./inputValidation.js");

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await contacts.getAll();
    return res.json({
      status: "success",
      code: 200,
      data: { allContacts },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await contacts.getContactById(req.params.contactId);

    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      return res.status(404).json({
        status: "Error",
        code: 404,
        data: "Not Found",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", validatePostPut, async (req, res, next) => {
  try {
    const contact = await contacts.addContact(req.body);

    return res.status(201).json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", validatePostPut, async (req, res, next) => {
  try {
    const contact = await contacts.updateContact(
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      return res.status(404).json({
        status: "Error",
        code: 404,
        data: "Not Found",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      return res.status(404).json({
        status: "Error",
        code: 404,
        data: "Not Found",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.patch("/:contactId", validatePatch, async (req, res, next) => {
  try {
    const contact = await contacts.updateContact(
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      return res.status(404).json({
        status: "Error",
        code: 404,
        data: "Not Found",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
