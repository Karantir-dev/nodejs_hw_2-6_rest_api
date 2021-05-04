const contacts = require("../model/contacts");

const getAll = async (_, res, next) => {
  try {
    const allContacts = await contacts.dbGetAll();
    return res.json({
      status: "success",
      code: 200,
      data: { allContacts },
    });
  } catch (err) {
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await contacts.dbGetContactById(req.params.contactId);

    return res.json({
      status: "success",
      code: 200,
      data: { contact },
    });
  } catch (err) {
    err.status = "error";
    if (err.name === "CastError") {
      err.code = 404;
      err.message = `Сontact with id ${err.value} not found.`;
    }

    next(err);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await contacts.dbAddContact(req.body);

    return res.status(201).json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (err) {
    err.status = "error";
    if (err.name === "MongoError") {
      err.code = 400;
      err.message = `Contact with this field ${JSON.stringify(
        err.keyValue
      ).replace(/"/g, "'")} already exist`;
    }
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await contacts.dbUpdateContact(
      req.params.contactId,
      req.body
    );

    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    }
  } catch (err) {
    err.status = "error";

    if (err.name === "CastError") {
      err.code = 404;
      err.message = `Contact with this id ${err.value._id} is absent`;
    } else if (err.name === "MongoError") {
      err.code = 400;
      err.message = `Contact with this field ${JSON.stringify(
        err.keyValue
      ).replace(/"/g, "'")} already exist`;
    }

    next(err);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const contact = await contacts.dbRemoveContact(req.params.contactId);
    console.log(contact);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      return res.status(404).json({
        status: "404 Not Found",
        message: `Contact with this id: ${req.params.contactId} is absent.`,
      });
    }
  } catch (err) {
    err.status = "error";
    if (err.name === "CastError") {
      err.code = 400;
      err.message = "Id format is not correct.";
    }
    next(err);
  }
};

module.exports = {
  getAll,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
