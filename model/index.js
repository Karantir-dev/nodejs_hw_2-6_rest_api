const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const DB_PATH = path.join(__dirname, "contacts.json");

const getAll = async () => {
  const allContacts = await fs.readFile(DB_PATH);

  return JSON.parse(allContacts);
};

const getContactById = async (contactId) => {
  const allContacts = await getAll();
  return allContacts.find(({ id }) => id === contactId);
};

const removeContact = async (contactId) => {
  let deletedContact = null;
  const allContacts = await getAll();

  const filteredContacts = allContacts.filter((contact) => {
    if (contact.id === contactId) {
      deletedContact = contact;
    }
    return !(contact.id === contactId);
  });

  await fs.writeFile(DB_PATH, JSON.stringify(filteredContacts, null, "\t"));

  return deletedContact;
};

const addContact = async (body) => {
  const contact = {
    id: nanoid(),
    ...body,
  };
  const allContacts = await getAll();
  allContacts.push(contact);

  await fs.writeFile(DB_PATH, JSON.stringify(allContacts, null, "\t"));
  console.log("Contact created.");
  return contact;
};

const updateContact = async (contactId, body) => {
  let updatedContact = null;

  const updatedContacts = await getAll().then((contacts) => {
    return contacts.map((contact) => {
      if (contact.id === contactId) {
        updatedContact = Object.assign(contact, body);

        return updatedContact;
      } else {
        return contact;
      }
    });
  });

  if (updatedContact) {
    await fs.writeFile(DB_PATH, JSON.stringify(updatedContacts, null, "\t"));
  }

  return updatedContact;
};

module.exports = {
  getAll,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
