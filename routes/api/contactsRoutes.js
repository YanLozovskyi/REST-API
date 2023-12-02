// /api/contacts

const express = require("express");
const contactsController = require("../../controllers/contactsControllers");

const { validaterBody } = require("../../decorators/index");
const contactsSchemas = require("../../schemas/contactsSchemas");

const {
  isMissingRequiredFields,
  isEmptyBody,
  isValidId,
  isValidToken,
} = require("../../middlewares/index");

const router = express.Router();
router.use(isValidToken);

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

// Оновити контакт
router.put(
  "/:id",
  isEmptyBody,
  isValidId,
  validaterBody(contactsSchemas.update),
  contactsController.update
);

// Оновити статус
router.patch(
  "/:id/favorite",
  isEmptyBody,
  isValidId,
  validaterBody(contactsSchemas.updateStatus),
  contactsController.update
);

module.exports = router;
