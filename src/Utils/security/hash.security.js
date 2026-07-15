import * as argon2 from "argon2";
import { SALT_ROUND } from "../../config/configService.js";
import { HASH_ENUM } from "../enums/security.emun.js";
import * as bcrypt from "bcrypt";
import { badRequestException } from "../response/error.response.js";

export const generateHash = async ({plainText, salt = Number(SALT_ROUND), algorithm = HASH_ENUM.BCRYPT}) => {
    let hashResults = '';
    switch(algorithm) {
        case HASH_ENUM.BCRYPT:
            hashResults = await bcrypt.hash(plainText, salt);
            break;
        case HASH_ENUM.ARGON2:
            hashResults = await argon2.hash(plainText);
            break;
        default:
            throw badRequestException('Unsupported hashing algorithm');
    }
    return hashResults;
};

export const compareHash = async ({plainText, cipherText, algorithm = HASH_ENUM.BCRYPT}) => {
    let isMatch = false;
    switch(algorithm) {
        case HASH_ENUM.BCRYPT:
            isMatch = await bcrypt.compare(plainText, cipherText);
            break;
        case HASH_ENUM.ARGON2:
            isMatch = await argon2.verify(cipherText, plainText);
            break;
        default:
            throw badRequestException('Unsupported hashing algorithm');
    }
    return isMatch;
};