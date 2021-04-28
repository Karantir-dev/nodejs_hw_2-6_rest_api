const contacts = require("../service");

const getAll = async (_, res, next) => {
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
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await contacts.getContactById(req.params.contactId);

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
    const contact = await contacts.addContact(req.body);

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
    const contact = await contacts.removeContact(req.params.contactId);

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
