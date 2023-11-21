const asyncHandler = require("express-async-handler");
const contactsService = require("../services/СontactsService");

class ContactsController {
  handleError(res, statusCode, message) {
    res.status(statusCode);
    throw new Error(message);
  }

  getAll = asyncHandler(async (req, res) => {
    const contacts = await contactsService.findAllContacts();
    if (!contacts) {
      this.handleError(res, 400, "Unable to fetch contacts");
    }
    res.status(200);
    res.json({ code: 200, contacts, quantity: contacts.length });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const contact = await contactsService.findOneContact(id);

    if (!contact) {
      this.handleError(res, 404, `Contact with id: ${id} is not found`);
    }

    res.status(200);
    res.json({ code: 200, contact });
  });

  add = asyncHandler(async (req, res) => {
    const contact = await contactsService.addContact({ ...req.body });

    if (!contact) {
      this.handleError(res, 400, "Unable to save contact");
    }

    res.status(201);
    res.json({ code: 201, contact });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const contact = await contactsService.updateContact(id, req.body);

    if (!contact) {
      this.handleError(res, 404, `Contact with id: ${id} is not found`);
    }

    res.status(200);
    res.json({ code: 200, contact });
  });

  remove = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const contact = await contactsService.removeContact(id);

    if (!contact) {
      this.handleError(res, 404, `Contact with id: ${id} is not found`);
    }

    res.status(200);
    res.json({ code: 200, message: `Contact: ${contact.name} deleted` });
  });
}

module.exports = new ContactsController();
