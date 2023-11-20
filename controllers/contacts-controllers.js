const asyncHandler = require("express-async-handler");
const contactsService = require("../services/СontactsService");

class contactsController {
  getAll = asyncHandler(async (req, res) => {
    const contacts = await contactsService.findAllContacts();
    if (!contacts) {
      res.status(400);
      throw new Error("Unable to fetch contacts");
    }
    res.status(200);
    res.json({ code: 200, contacts, quantity: contacts.length });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const contact = await contactsService.findOneContact(id);

    if (!contact) {
      res.status(404);
      throw new Error(`Contact with id: ${id} is not found`);
    }

    res.status(200);
    res.json({ code: 200, contact });
  });

  add = asyncHandler(async (req, res) => {
    const contact = await contactsService.addContact({ ...req.body });

    if (!contact) {
      res.status(400);
      throw new Error("Unable to save contact");
    }

    res.status(201);
    res.json({ code: 201, contact });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const contact = await contactsService.updateContact(id, req.body);

    if (!contact) {
      res.status(404);
      throw new Error(`Contact with id: ${id} is not found`);
    }

    res.status(200);
    res.json({ code: 200, contact });
  });

  remove = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const contact = await contactsService.removeContact(id);

    if (!contact) {
      res.status(404);
      throw new Error(`Contact with id: ${id} is not found`);
    }

    res.status(200);
    res.json({ code: 200, message: `Contact: ${contact.name} deleted` });
  });
}

module.exports = new contactsController();
