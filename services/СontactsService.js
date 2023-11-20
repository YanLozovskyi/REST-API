const contactModel = require("../models/contactModel");

class ContactsService {
  findAllContacts = async () => {
    const contacts = await contactModel.find({});
    return contacts || null;
  };

  findOneContact = async (id) => {
    const contacts = await contactModel.findById(id);
    return contacts || null;
  };

  addContact = async (data) => {
    const contact = await contactModel.create({ ...data });
    return contact || null;
  };

  updateContact = async (id, data) => {
    const contact = await contactModel.findByIdAndUpdate(
      id,
      { ...data },
      { runValidators: true, new: true }
    );

    return contact || null;
  };

  removeContact = async (id) => {
    const contact = await contactModel.findByIdAndDelete(id);
    return contact || null;
  };
}

module.exports = new ContactsService();
