const userModel = require("../models/userModel");
// const HttpError = require("../helpers/HttpError");
const { HttpError, sendEmail } = require("../helpers/index");
const bcrypt = require("bcryptjs");
const { JWT_SECRET, BASE_URL } = process.env;
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const avatarsPath = path.resolve("public", "avatars");

class UserAuthService {
  register = async (email, password, data) => {
    const user = await userModel.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const verificationCode = nanoid();
    const avatar = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationCode}">Click verify email</a>`,
    };
    await sendEmail(verifyEmail);
    const newUser = await userModel.create({
      ...data,
      password: hashPassword,
      avatarURL: avatar,
      verificationCode,
    });
    return newUser || null;
  };

  login = async (email, password) => {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verify");
    }

    const passwordCompare = bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
    const updatedUser = await userModel.findByIdAndUpdate(user._id, { token });

    return { updatedUser, token } || null;
  };

  logout = async (_id) => {
    if (!_id) {
      throw HttpError(401, "Not authorized");
    }
    const result = await userModel.findByIdAndUpdate(_id, { token: "" });
    return result || null;
  };

  changeStatus = async (_id, subscription) => {
    if (!_id) {
      throw HttpError(401, "Not authirized");
    }

    const user = userModel.findByIdAndUpdate(_id, { subscription });

    return user || null;
  };

  changeAvatar = async (_id, oldPath, filename) => {
    if (!_id) {
      throw HttpError(401, "Not authirized");
    }

    const newPath = path.join(avatarsPath, filename);
    const resizedImage = await Jimp.read(oldPath);
    await resizedImage.resize(250, 250).writeAsync(oldPath);

    await fs.rename(oldPath, newPath);
    const newAvatarUrl = path.join("public", "avatars", filename);

    const avatar = await userModel.findByIdAndUpdate(_id, {
      avatarURL: newAvatarUrl,
    });
    return avatar || null;
  };

  sendVerifyEmail = async (verificationCode) => {
    const user = await userModel.findOne({ verificationCode });

    if (!user) {
      throw HttpError(404, "User not Found");
    }
    await userModel.findByIdAndUpdate(user._id, {
      verificationCode: "",
      verify: true,
    });
  };

  resendEmail = async (email) => {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw HttpError(404, "User not Found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationCode}">Click verify email</a>`,
    };
    await sendEmail(verifyEmail);
  };
}

module.exports = new UserAuthService();
