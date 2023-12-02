// /api/users

const express = require("express");
const usersControllers = require("../../controllers/usersControllers");

const { validaterBody } = require("../../decorators/index");
const { isEmptyBody, isValidToken } = require("../../middlewares/index");
const usersSchemas = require("../../schemas/usersSchemas");

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validaterBody(usersSchemas.userSignSchema),
  usersControllers.signup
);

authRouter.post(
  "/login",
  isEmptyBody,
  validaterBody(usersSchemas.userSignSchema),
  usersControllers.signin
);

authRouter.get("/current", isValidToken, usersControllers.getCurrentUser);

authRouter.post("/logout", isValidToken, usersControllers.signout);

authRouter.patch(
  "/subscription",
  isValidToken,
  validaterBody(usersSchemas.userUpdateStatusSchema),
  usersControllers.onChangeSubscription
);

module.exports = authRouter;
