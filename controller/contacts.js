const HttpCode = require("../helpers/constants");
const contacts = require("../model/contacts");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const allContacts = await contacts.dbGetAll(userId, req.query);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      ResponseBody: { ...allContacts },
    });
  } catch (err) {
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await contacts.dbGetContactById(
      req.params.contactId,
      userId
    );

    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        ResponseBody: { contact },
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: `${HttpCode.NOT_FOUND} Not Found`,
    });
  } catch (err) {
    err.status = "Bad Request";
    if (err.name === "CastError") {
      err.code = HttpCode.BAD_REQUEST;
      err.message = "Id format is not correct.";
    }

    next(err);
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await contacts.dbAddContact(req.body, userId);

    if (contact) {
      return res.status(HttpCode.CREATED).json({
        status: "success",
        code: HttpCode.CREATED,
        ResponseBody: { contact },
      });
    }
  } catch (err) {
    err.status = "error";
    if (err.name === "MongoError") {
      err.code = HttpCode.BAD_REQUEST;
      err.message = `Contact with this field ${JSON.stringify(
        err.keyValue
      ).replace(/"/g, "'")} already exist`;
    }
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await contacts.dbUpdateContact(
      req.params.contactId,
      userId,
      req.body
    );

    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        ResponseBody: { contact },
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      Status: `${HttpCode.NOT_FOUND} Not found`,
    });
  } catch (err) {
    err.status = "Bad Request";

    if (err.name === "CastError") {
      err.code = HttpCode.BAD_REQUEST;
      err.message = "Id format is not correct.";
    } else if (err.name === "MongoError") {
      err.code = HttpCode.BAD_REQUEST;
      err.message = `Contact with this field 
      ${JSON.stringify(err.keyValue).replace(/"/g, "'")} already exist.`;
    }

    next(err);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await contacts.dbRemoveContact(
      req.params.contactId,
      userId
    );

    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        ResponseBody: { contact },
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: `${HttpCode.NOT_FOUND} Not Found`,
      message: `Contact with this id: ${req.params.contactId} is absent.`,
    });
  } catch (err) {
    err.status = "Bad Request";
    if (err.name === "CastError") {
      err.code = HttpCode.BAD_REQUEST;
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
