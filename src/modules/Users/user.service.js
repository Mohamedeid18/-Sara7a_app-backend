import jwt from 'jsonwebtoken'
import { findById } from '../../DB/database.repository.js';
import UserModel from '../../DB/Models/user.model.js';
import { ACCESS_SECRET_USER_TOKEN } from '../../config/configService.js';
import { internalServerException, notFoundException } from '../../Utils/response/error.response.js';
import { successResponse } from '../../Utils/response/success.response.js';
import { verifyToken } from '../../Utils/tokens/token.js';
import { decrypt } from '../../Utils/security/encryption.security.js';
export const getProfile = async (req, res) => {
    const {user} = req
    if(user.phone) user.phone = decrypt(user.phone);
    successResponse({res,statusCod:200,message: 'User profile retrieved successfully', data:user});
     return internalServerException('Failed to retrieve user profile');
};