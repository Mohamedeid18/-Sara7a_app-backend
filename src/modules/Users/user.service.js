import fs from "node:fs";
import {
  deleteOne,
  findById,
  findByIdAndUpdate,
  findOneAndUpdate,
  updateOne,
} from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";

import {
  forbiddenException,
  notFoundException,
} from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { decrypt } from "../../Utils/security/encryption.security.js";
import {
  compareHash,
  generateHash,
} from "../../Utils/security/hash.security.js";
import { HASH_ENUM } from "../../Utils/enums/security.emun.js";
import { RoleEnum } from "../../Utils/enums/user.enum.js";
import cloudinary from "../../Utils/multer/cloudinary.multer.js";
import { defaultProfileImage } from "../../Utils/assets/defualtProfileImage.js";
export const getProfile = async (req, res) => {
  const { user } = req;
  if (user.phone) user.phone = decrypt(user.phone);
  successResponse({
    res,
    statusCode: 200,
    message: "User profile retrieved successfully",
    data: user,
  });
};
//profile image from cloudinary
export const getProfileImageCloud = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(badRequestException({ message: "No image file provided" }));
    }

    const options = {
      folder: `sara7a/users/${req.user._id}`,
    };

    const isDefaultImage =
      req.user.profileImage?.public_id === defaultProfileImage(req.user.gender).public_id;

    if (!isDefaultImage && req.user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(req.user.profileImage.public_id);
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { ...options }
    );

    if (!secure_url || !public_id) {
      return next(badRequestException({ message: "Failed to upload profile image" }));
    }
    const user = await findByIdAndUpdate({
      model: UserModel,
      id: req.user._id,
      update: { profileImage: { secure_url, public_id } },
      options: { returnDocument: "after" }
    });
    return successResponse({
      res,
      statusCode: 200,
      message: "Profile image uploaded successfully",
      data: user,
    });

  } catch (error) {
    return next(error);
  } finally {
    if (req.file?.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (unlinkError) {
        console.error("Failed to cleanup temporary file:", unlinkError);
      }
    }
  }
};
export const getProfileImage = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    update: { profileImage: { secure_url: req.file.secure_url, public_id: req.file.public_id } },
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
    update: { coverImages: req.files.map((file) => ({ secure_url: file.secure_url, public_id: file.public_id })) },
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
export const freezeAccount = async (req, res) => {
  const { userId } = req.params;
  const targetUserId = userId || req.user._id;
  if(targetUserId.toString() !== req.user._id.toString() && req.user.role !== RoleEnum.ADMIN) {
    return notFoundException("Unauthorized to freeze this account");
  }
  const updatedUser = await findOneAndUpdate({
    model: UserModel,
    filter: { _id: targetUserId ,freezeAt: { $exists: false } },
    update: { 
      freezeBy:req.user._id,
      freezeAt: new Date(),
      freezeByRole: req.user.role,
      $unset:{ restoredBy: true, restoredAt: true }
     },
  });
  if(!updatedUser) {
    return notFoundException("User not found or account is already frozen");
  }
  successResponse({
    res,
    message: "Account frozen successfully"
  });
};
export const restoredAccount = async (req, res) => {
  const { userId } = req.params;
  const targetUserId = userId || req.user._id;
  const user = await findById({model:UserModel,id:targetUserId});
  if(!user || !user.freezeAt){
    throw notFoundException('user not found or account is not frozen')
  }
  if(user.freezeByRole === RoleEnum.ADMIN){
    if(req.user.role !== RoleEnum.ADMIN){
      throw forbiddenException('This Account was frozen by an Admin, only an Admin can restore this it.')
    }
  }else{
    if(targetUserId.toString() !== req.user._id.toString() 
      && req.user._id !== RoleEnum.ADMIN){
    throw forbiddenException("You are not authorized to restore this account")
  }
  }
  const updateUser = await findOneAndUpdate({model:UserModel,
      filter:{_id:targetUserId},
      update: { 
      restoredBy:req.user._id,
      restoredAt: new Date(),
      $unset:{ freezeBy: true, freezeAt: true,freezeByRole: true }
     },
    }
  )

  successResponse({
    res,
    message: "Account restored successfully",
    data:{updateUser}
  });
};
export const hardDeleteAccount = async (req, res) => {
  const { userId } = req.params;
  

  const result = await deleteOne({model:UserModel,filter:{_id:userId}})
  if(!result.deletedCount) throw notFoundException("User not found")

  successResponse({
    res,
    message: "Account hard deleted successfully",
  });
};