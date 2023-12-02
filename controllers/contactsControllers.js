const asyncHandler = require("express-async-handler");
const contactsService = require("../services/СontactsService");
const HttpError = require("../helpers/HttpError");

class ContactsController {
  getAll = asyncHandler(async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, ...filterParams } = req.query;
    const skip = (page - 1) * limit;
    const filter = { owner, ...filterParams };
    const contacts = await contactsService.findAllContacts(filter, skip, limit);

    if (!contacts) {
      throw HttpError(400, "Unable to fetch contacts");
    }
    res.status(200);
    res.json({ code: 200, contacts, quantity: contacts.length });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const contact = await contactsService.findOneContact({
      _id: id,
      owner,
    });

    if (!contact) {
      throw HttpError(400, `Contact with id: ${id} is not found`);
    }

    res.status(200);
    res.json({ code: 200, contact });
  });

  add = asyncHandler(async (req, res) => {
    const { _id: owner } = req.user;
    const contact = await contactsService.addContact({ ...req.body, owner });

    if (!contact) {
      throw HttpError(400, "Unable to save contact");
    }

    res.status(201);
    res.json({ code: 201, contact });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const contact = await contactsService.updateContact(
      { _id: id, owner },
      req.body
    );
    console.log(contact);
    if (!contact) {
      throw HttpError(404, "Not Found");
    }
    res.status(201).json(contact);
  });

  remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const contact = await contactsService.removeContact({
      _id: id,
      owner,
    });

    if (!contact) {
      throw HttpError(400, `Contact with id: ${id} is not found`);
    }

    res.status(200);
    res.json({ code: 200, message: `Contact: ${contact.name} deleted` });
  });
}

module.exports = new ContactsController();
