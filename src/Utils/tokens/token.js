import jwt from "jsonwebtoken";
import { RoleEnum, SignatureEnum } from "../enums/user.enum.js";
import { v4 as uuidv4 } from "uuid";
export const generateToken = ({ payload, secret, options }) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = ({ token, secret }) => {
  return jwt.verify(token, secret);
};

export const getSignature = ({ signatureLevel = SignatureEnum.USER }) => {
  const signature = {
    accessSignature: undefined,
    refreshSignature: undefined,
    expiresIn: undefined,
    refreshExpiresIn: undefined,
  };
  switch (signatureLevel) {
    case SignatureEnum.USER:
      signature.accessSignature = process.env.ACCESS_SECRET_USER_TOKEN;
      signature.refreshSignature = process.env.REFRESH_SECRET_USER_TOKEN;
      signature.expiresIn = process.env.ACCESS_USER_EXPIRES_IN;
      signature.refreshExpiresIn = process.env.REFRESH_USER_EXPIRES_IN;
      break;
    case SignatureEnum.ADMIN:
      signature.accessSignature = process.env.ACCESS_SECRET_ADMIN_TOKEN;
      signature.refreshSignature = process.env.REFRESH_SECRET_ADMIN_TOKEN;
      signature.expiresIn = process.env.ACCESS_ADMIN_EXPIRES_IN;
      signature.refreshExpiresIn = process.env.REFRESH_ADMIN_EXPIRES_IN;
      break;
    default:
      signature.accessSignature = process.env.ACCESS_SECRET_USER_TOKEN;
      signature.refreshSignature = process.env.REFRESH_SECRET_USER_TOKEN;
      signature.expiresIn = process.env.ACCESS_USER_EXPIRES_IN;
      signature.refreshExpiresIn = process.env.REFRESH_USER_EXPIRES_IN;
      break;
  }
  return signature;
};

export const getNewLoginCredentials = async (user) => {
  const signature = await getSignature({
    signatureLevel:
      user.role !== RoleEnum.ADMIN ? SignatureEnum.USER : SignatureEnum.ADMIN,
  });
  const jwtId = uuidv4();
  const accessToken = generateToken({
    payload: { id: user._id },
    secret: signature.accessSignature,
    options: { expiresIn: Number(signature.expiresIn), jwtid: jwtId },
  });
  const refreshToken = generateToken({
    payload: { id: user._id },
    secret: signature.refreshSignature,
    options: { expiresIn: Number(signature.refreshExpiresIn), jwtid: jwtId },
  });

  return { accessToken, refreshToken };
};
