import jwt from "jsonwebtoken";
import {
  findById,
  findByIdAndUpdate,
  updateOne,
} from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import { ACCESS_SECRET_USER_TOKEN } from "../../config/configService.js";
import {
  internalServerException,
  notFoundException,
} from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { verifyToken } from "../../Utils/tokens/token.js";
import { decrypt } from "../../Utils/security/encryption.security.js";
import {
  compareHash,
  generateHash,
} from "../../Utils/security/hash.security.js";
import { HASH_ENUM } from "../../Utils/enums/security.emun.js";
export const getProfile = async (req, res) => {
  const { user } = req;
  if (user.phone) user.phone = decrypt(user.phone);
  successResponse({
    res,
    statusCode: 200,
    message: "User profile retrieved successfully",
    data: user,
  });
  return internalServerException("Failed to retrieve user profile");
};
export const getProfileImage = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    update: { profileImage: req.file.finalPath },
  });
  successResponse({
    res,
    statusCode: 200,
    message: "File uploaded successfully",
    data: user,
  });
};
export const getCoverImages = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    update: { coverImages: req.files.map((file) => file.finalPath) },
  });
  successResponse({
    res,
    statusCode: 200,
    message: "File uploaded successfully",
    data: user,
  });
};
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;;
  // Check if the old password is valid
  const isValidOldPassword = await compareHash({
    plainText: oldPassword,
    cipherText: req.user.password,
    algorithm: HASH_ENUM.BCRYPT,
  });
  if (!isValidOldPassword) {
    return notFoundException("Invalid Credentials");
  }
  const hashPassword = await generateHash({
    plainText: newPassword,
    algorithm: HASH_ENUM.BCRYPT,
  });

  await updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    update: { password: hashPassword },
  });
  successResponse({
    res,
    statusCode: 200,
    message: "Password updated successfully",
  });
};
