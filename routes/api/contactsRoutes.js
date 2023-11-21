// /api/contacts

const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contactsControllers");

const { validaterBody } = require("../../decorators/index");
const contactsSchemas = require("../../schemas/contactsSchemas");

const {
  isMissingRequiredFields,
  isEmptyBody,
  isValidId,
} = require("../../middlewares/index");

// Отримати всі контакти
router.get("/", contactsController.getAll);

// Отримати один контакт
router.get("/:id", isValidId, contactsController.getById);

// Додати контакт
router.post(
  "/",
  isEmptyBody,
  isMissingRequiredFields,
  validaterBody(contactsSchemas.add),
  contactsController.add
);

// Видалити контакт
router.delete("/:id", isValidId, contactsController.remove);

// Обновити контакт
router.put(
  "/:id",
  isEmptyBody,
  isValidId,
  validaterBody(contactsSchemas.update),
  contactsController.update
);

// Обновити статус
router.patch(
  "/:id/favorite",
  isEmptyBody,
  isValidId,
  validaterBody(contactsSchemas.updateStatus),
  contactsController.update
);

module.exports = router;
