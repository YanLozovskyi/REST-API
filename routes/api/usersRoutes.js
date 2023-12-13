// /users

const express = require("express");

const { validaterBody } = require("../../decorators/index");
const {
  isEmptyBody,
  isValidToken,
  upload,
} = require("../../middlewares/index");
const usersControllers = require("../../controllers/usersControllers");
const usersSchemas = require("../../schemas/usersSchemas");

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  isEmptyBody,
  validaterBody(usersSchemas.userSignSchema),
  usersControllers.signup
);

authRouter.get("/verify/:verificationCode", usersControllers.verifyEmail);

authRouter.post(
  "/verify",
  isEmptyBody,
  validaterBody(usersSchemas.userSendVerifySchema),
  usersControllers.sendVerifyMore
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

authRouter.patch(
  "/avatars",
  upload.single("avatar"),
  isValidToken,
  validaterBody(usersSchemas.userUpdateAvatarSchema),
  usersControllers.onChangeAvatar
);

module.exports = authRouter;
