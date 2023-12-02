const contactModel = require("../models/contactModel");

class ContactsService {
  findAllContacts = async (filter, skip, limit) => {
    const contacts = await contactModel.find(filter, "-createdAt -updatedAt", {
      skip,
      limit,
    });
    return contacts || null;
  };

  findOneContact = async ({ _id: id, owner }) => {
    const contact = await contactModel.findOne({ _id: id, owner });
    return contact || null;
  };

  addContact = async (data) => {
    const contact = await contactModel.create({ ...data });
    return contact || null;
  };

  updateContact = async ({ _id: id, owner }, data) => {
    const contact = await contactModel.findOneAndUpdate(
      { _id: id, owner },
      data
    );
    return contact || null;
  };

  removeContact = async ({ _id: id, owner }) => {
    const contact = await contactModel.findOneAndDelete({ _id: id, owner });
    return contact || null;
  };
}

module.exports = new ContactsService();
