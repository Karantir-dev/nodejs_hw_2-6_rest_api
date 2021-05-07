const Contact = require("./schemas/contact");

const dbGetAll = async (userId, query) => {
  const { limit = 5, page = 1, favorite = null } = query;
  const searchOptions = { owner: userId };
  if (favorite !== null) {
    searchOptions.favorite = favorite;
  }
  const result = await Contact.paginate(searchOptions, {
    limit,
    page,
    populate: {
      path: "owner",
      select: "email subscription",
    },
  });
  const { docs: contacts, totalDocs: total } = result;

  return { contacts, total, limit, page };
};

const dbGetContactById = (contactId, userId) => {
  return Contact.findOne({ _id: contactId, owner: userId }).populate({
    path: "owner",
    select: "email",
  });
};

const dbRemoveContact = (contactId, userId) => {
  return Contact.findByIdAndRemove({ _id: contactId, owner: userId });
};

const dbAddContact = (body, userId) => {
  return Contact.create({ ...body, owner: userId });
};

const dbUpdateContact = async (contactId, userId, body) => {
  return await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
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
