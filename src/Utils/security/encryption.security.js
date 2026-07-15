import crypto from 'node:crypto'
import { ENC_KEY } from './../../config/configService.js';

const IV_LENGTH = 16;
const ENC_SECRET_KEY = Buffer.from(ENC_KEY);

export const encrypt = (text) => {
    const IV = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENC_SECRET_KEY, IV);
    let encryptedData = cipher.update(text, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return `${IV.toString('hex')}:${encryptedData}`;
};

export const decrypt = (text) => {
    const [ivHex, encryptedText] = text.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_SECRET_KEY, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};