import { findById } from "../DB/database.repository.js";
import UserModel from "../DB/Models/user.model.js";
import { SignatureEnum, TokenTypeEnum } from "../Utils/enums/user.enum.js";
import { forbiddenException, notFoundException } from "../Utils/response/error.response.js";
import { getSignature, verifyToken } from "../Utils/tokens/token.js";

export const decodeToken = async ({
    authorization,
    tokenType = TokenTypeEnum.ACCESS,
})=>{
    const [Bearer, token] = authorization.trim().split(' ')||[];
    let signature = await getSignature({
        signatureLevel: Bearer === "ADMIN" ? 
        SignatureEnum.ADMIN : Bearer === "USER" ? 
        SignatureEnum.USER : new Error('Invalid token type') })

    const decoded = verifyToken({
        token,
        secret: 
        tokenType === TokenTypeEnum.ACCESS?
        signature.accessSignature:
        signature.refreshSignature
    });
    const user = await findById({model: UserModel, id: decoded.id,options: {lean:true}});
    if(!user) throw notFoundException('User Not Found');

    return {user, decoded};
};
export const authenticateToken = ({tokenType = TokenTypeEnum.ACCESS}) => {
  return async (req, res, next) => {
    const {user,decoded} = (await decodeToken({
      authorization: req.headers.authorization,
      tokenType
    })) || {};

    req.user = user;
    req.decoded = decoded;

    next();
  };
};
export const authorization = ({accessRoles=[]}) => {
  return async (req, res, next) => {
    if(!accessRoles.includes(req.user.role)) {
      throw forbiddenException("Unauthorized Access")
    }
    next();
  };
};