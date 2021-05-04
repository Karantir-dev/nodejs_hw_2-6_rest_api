const Contact = require("./schemas/contact");

const dbGetAll = () => {
  return Contact.find();
};

const dbGetContactById = (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const dbRemoveContact = (contactId) => {
  return Contact.findByIdAndRemove({ _id: contactId });
};

const dbAddContact = (body) => {
  return Contact.create(body);
};

const dbUpdateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true }
  );
};

module.exports = {
  dbGetAll,
  dbGetContactById,
  dbRemoveContact,
  dbAddContact,
  dbUpdateContact,
};
