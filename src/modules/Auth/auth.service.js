import {
  badRequestException,
  conflictException,
  internalServerException,
} from "../../Utils/response/error.response.js";
import UserModel from "./../../DB/Models/user.model.js";
import { findOne, create, updateOne, findOneAndUpdate } from "./../../DB/database.repository.js";
import { successResponse } from "./../../Utils/response/success.response.js";
import {
  compareHash,
  generateHash,
} from "../../Utils/security/hash.security.js";
import { HASH_ENUM } from "../../Utils/enums/security.emun.js";
import { decrypt, encrypt } from "../../Utils/security/encryption.security.js";
import { getNewLoginCredentials } from "../../Utils/tokens/token.js";
import { OAuth2Client } from "google-auth-library";
import { CLIENT_ID } from "../../config/configService.js";
import { LogoutTypeEnum, ProviderEnum } from "../../Utils/enums/user.enum.js";
import TokenModel from "../../DB/Models/token.model.js";
import { generateOTP } from "../../Utils/generateOTP.utlis.js";
import { emailEvent } from "../../Utils/events/email.event.js";


export const signup = async (req, res) => {
  const { userName, email, password, phone } = req.body;
  if (await findOne({ model: UserModel, filter: { email } })) {
    throw conflictException({ message: "User already exists" });
  }
  const opt = await generateOTP();
  //hash OTP 
  const hashOTP = await generateHash({
    plainText: opt,
    algorithm: HASH_ENUM.ARGON2,
  });
  //hash password
  const hashPassword = await generateHash({
    plainText: password,
    algorithm: HASH_ENUM.BCRYPT,
  });
  const encryptedPhone = await encrypt(phone);
  const user = await create({
    model: UserModel,
    data: [{ userName, email, password: hashPassword, phone: encryptedPhone, confirmEmailOTP: hashOTP }],
  });

  //emit confirmEmail event
  emailEvent.emit("confirmEmail", {
    to:email,
    otp: opt,
    userName: userName
  });

  successResponse({
    res,
    message: "User created successfully",
    data: { user },
  });
};
export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await findOne({
    model: UserModel,
    filter: { email, confirmEmailOTP: { $exists: true },confirmEmail:{ $exists: false } },
    options: { lean: true },
  });
  if (!user) {
    throw conflictException({ message: "user not found" });
  }
  const isMatch = await compareHash({
    plainText: otp,
    cipherText: user.confirmEmailOTP,
    algorithm: HASH_ENUM.ARGON2,
  });
  if (!isMatch) {
    throw conflictException({ message: "Invalid OTP" });
  }
  await updateOne({
    model: UserModel,
    filter: { email },
    update: { confirmEmail: Date.now() ,
      $unset: { confirmEmailOTP: true}
     },
  });
  successResponse({
    res,
    statusCode:200,
    message: "Email confirmed successfully",
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findOne({
    model: UserModel,
    filter: { email , confirmEmail: { $exists: true } },
    select: "firstName lastName email password phone role",
    options: { lean: true },
  });
  if (!user) {
    throw conflictException({ message: "Invalid email or password" });
  }
  const isMatch = await compareHash({
    plainText: password,
    cipherText: user.password,
    algorithm: HASH_ENUM.BCRYPT,
  });
  const decryptedPhone = decrypt(user.phone);
  user.phone = decryptedPhone;
  if (!isMatch) {
    throw conflictException({ message: "Invalid email or password" });
  }
  const token = await getNewLoginCredentials(user);

  successResponse({
    res,
    message: "User logged in successfully",
    data: { token },
  });
};
export const refreshToken = async (req, res) => {
  const { user } = req;
  const { accessToken } = await getNewLoginCredentials(user);
  successResponse({
    res,
    status: 200,
    message: "Token refreshed successfully",
    data: { accessToken },
  });
};
//remember to implement the refresh token logic in the token.js file
const verifyGoogle = async ({ idToken }) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};
export const socialLogin = async (req, res) => {
  const { idToken } = req.body;
  const { email, email_verified, given_name, family_name, picture } =
    await verifyGoogle({ idToken });
  if (!email_verified) {
    throw conflictException({ message: "Email not verified" });
  }
  const user = await findOne({ model: UserModel, filter: { email } });
  if (user) {
    // User exists, generate tokens
    if (user.provider === ProviderEnum.GOOGLE) {
      const token = await getNewLoginCredentials(user);
      successResponse({
        res,
        message: "Social login successful",
        data: { token },
      });
    }
  } else {
    // User does not exist, create new user
    const newUser = await create({
      model: UserModel,
      data: [
        {
          email,
          firstName: given_name,
          lastName: family_name,
          provider: ProviderEnum.GOOGLE,
          profileImage: picture,
        },
      ],
    });
    const token = await getNewLoginCredentials(newUser);
    successResponse({
      res,
      message: "User created and logged in successfully",
      data: { token },
    });
  }
};
export const logout = async (req, res) => {
  const { flag } = req.body;
  let statusCode = 200;

  switch (flag) {
    case LogoutTypeEnum.LOGOUT:
      await create({
        model: TokenModel,
        data: [
          {
            jti: req.decoded.jti,
            userId: req.user._id,
            expiresIn: new Date(req.decoded.exp * 1000),
          },
        ],
      });
      statusCode = 201;
      break;

    case LogoutTypeEnum.LOGOUT_ALL:
      await updateOne({
        model: UserModel,
        filter: { _id: req.user._id },
        update: { changeCredentialsTime: new Date() },
      });
      statusCode = 200;
      break;

    default:
      throw badRequestException({ message: "Invalid logout flag" });
  }

  return successResponse({
    res,
    message: "User logged out successfully",
    statusCode,
  });
};
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const hashOtp = await generateHash({
    plainText: otp,
    algorithm: HASH_ENUM.ARGON2
  });
  const user = await findOneAndUpdate({
    model: UserModel,
    filter: { email , confirmEmail: {$exists: true},provider: ProviderEnum.SYSTEM },
    update:{ forgetPasswordOTP: hashOtp }
  });
  if(!user) {
    throw notFoundException({ message: "User not found" });
  }
  emailEvent.emit("forgetPassword", {
    to:email,
    otp,
    userName: user.userName
  });
  successResponse({
    res,
    message: "OTP sent successfully to reset password"
  });
};
export const resetPassword = async (req, res) => {
  const { otp, newPassword , email } = req.body;
  const user = await findOne({
    model:UserModel,
    filter:{ email ,
      provider: ProviderEnum.SYSTEM,
      forgetPasswordOTP: { $exists: true },
      confirmEmail: { $exists: true }
    }
  })
  if(!user) {
    throw notFoundException({ message: "User not found" });
  }
  const isValidOtp = await compareHash({
    plainText:otp,
    cipherText: user.forgetPasswordOTP,
    algorithm: HASH_ENUM.ARGON2
  })
  if(!isValidOtp) {
    throw badRequestException({ message: "Invalid OTP" });
  }
  const hashPassword = await generateHash({
    plainText: newPassword,
    algorithm: HASH_ENUM.BCRYPT
  });
  await findOneAndUpdate({
    model: UserModel,
    filter: { email },
    update: { password: hashPassword,  $unset: { forgetPasswordOTP: true } }
  });
  successResponse({
    res,
    message: "Password reset successfully"
  });
};
// expire: Time OTP .--- > 5min
// Api Resend otp