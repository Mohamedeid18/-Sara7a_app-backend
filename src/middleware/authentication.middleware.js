import { findById, findOne } from "../DB/database.repository.js";
import TokenModel from "../DB/Models/token.model.js";
import UserModel from "../DB/Models/user.model.js";
import { SignatureEnum, TokenTypeEnum, RoleEnum } from "../Utils/enums/user.enum.js";
import { forbiddenException, notFoundException, unauthorizedException } from "../Utils/response/error.response.js";
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
    // check revoke  token 
    if(await findOne({model: TokenModel, filter: {jti: decoded.jti}})) {
      throw unauthorizedException('Token has been revoked');
    }
    const user = await findById({model: UserModel, id: decoded.id,options: {lean:true}});
    if(!user) throw notFoundException('User Not Found');

    if((user.changeCredentialsTime?.getTime() || 0) > decoded.iat * 1000) {
      throw unauthorizedException('token is expired');
    }

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