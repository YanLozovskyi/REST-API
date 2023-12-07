const asyncHandler = require("express-async-handler");
const HttpError = require("../helpers/HttpError");
const usersAuthService = require("../services/userAuthService");

class UsersController {
  signup = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const newUser = await usersAuthService.register(email, password, req.body);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  });

  signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { updatedUser, token } = await usersAuthService.login(
      email,
      password
    );

    res.json({
      token,
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
        avatarURL: updatedUser.avatarURL,
      },
    });
  });

  getCurrentUser = asyncHandler(async (req, res) => {
    const { email, subscription } = req.user;

    if (!email) {
      throw HttpError(401, "Not authorized");
    }

    res.json({
      email,
      subscription,
    });
  });

  signout = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const result = await usersAuthService.logout(_id);
    if (!result) {
      throw HttpError(401, "Not authorized");
    }

    res.status(204).json({ message: "Logout Success" });
  });

  onChangeSubscription = asyncHandler(async (req, res) => {
    const { subscription } = req.body;
    const { _id } = req.user;

    const user = await usersAuthService.changeStatus(_id, subscription);

    res.status(201).json({ user: { email: user.email, subscription } });
  });

  onChangeAvatar = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;

    const avatar = await usersAuthService.changeAvatar(_id, oldPath, filename);
    res.status(200).json({
      avatarURL: avatar.avatarURL,
    });
  });
}

module.exports = new UsersController();
