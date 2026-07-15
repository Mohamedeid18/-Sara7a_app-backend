import { conflictException, internalServerException } from "../../Utils/response/error.response.js"
import UserModel from './../../DB/Models/user.model.js';
import {findOne,create} from './../../DB/database.repository.js'
import { successResponse } from './../../Utils/response/success.response.js';
import { compareHash, generateHash } from "../../Utils/security/hash.security.js";
import { HASH_ENUM } from "../../Utils/enums/security.emun.js";
import { decrypt, encrypt } from "../../Utils/security/encryption.security.js";
import {getNewLoginCredentials } from "../../Utils/tokens/token.js";
export const signup = async (req, res) => {
        const {userName, email, password, phone} = req.body;
        if(await findOne({ model: UserModel, filter: { email } })) {
            throw conflictException({message: 'User already exists'})
        }
        const hashPassword = await generateHash({plainText: password, algorithm: HASH_ENUM.BCRYPT});
        const encryptedPhone = await encrypt(phone);
        const user = await create({model: UserModel, data: [{userName, email, password: hashPassword, phone: encryptedPhone}]});
        successResponse({res, message: 'User created successfully', data: {user}});
};
export const login = async (req, res) => {
        const { email, password} = req.body;
        const user = await findOne({ model: UserModel, filter: { email },select:"firstName lastName email password phone role",options: { lean: true } });
        if(!user) {
            throw conflictException({message: 'Invalid email or password'})
        }
        const isMatch = await compareHash({plainText: password, cipherText: user.password, algorithm: HASH_ENUM.BCRYPT});
        const decryptedPhone =  decrypt(user.phone);
        user.phone = decryptedPhone;
        if(!isMatch) {
            throw conflictException({message: 'Invalid email or password'})
        }
        const token = await getNewLoginCredentials(user);

        successResponse({res, message: 'User logged in successfully', data: {token}});
};
export const refreshToken = async (req, res) => {
    const {user} = req;
    const {accessToken} = await getNewLoginCredentials(user);
    successResponse({res, status: 200, message: 'Token refreshed successfully', data: {accessToken}});
};
//remember to implement the refresh token logic in the token.js file
export const socialLogin = async (req, res) => {
    
    successResponse({res, status: 200, message: 'Social login successful'});
};