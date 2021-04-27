const Contact = require("./schema");

const getAll = () => {
  return Contact.find();
};

const getContactById = (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const removeContact = (contactId) => {
  return Contact.findByIdAndRemove({ _id: contactId });
};

const addContact = (body) => {
  return Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true }
  );
};

module.exports = {
  getAll,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
