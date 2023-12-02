const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const HttpError = require("../helpers/HttpError");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const isValidToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw HttpError(401, "Authorization header not found");
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpError(401);
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findById(id);
    if (!user || !user.token || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    throw HttpError(401, error.message);
  }
});

module.exports = isValidToken;
