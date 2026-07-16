import dotenv from 'dotenv'
import {resolve} from 'node:path'


const envPath = {
    development:"dev.env",
    staging:"stag.env",
    production:"prod.env"
}

dotenv.config({ path: resolve(`./src/config/${envPath.development}`) })

export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = process.env.PORT || 5000
export const DB_URL = process.env.DB_URL;
export const SALT_ROUND = process.env.SALT_ROUND
export const ENC_KEY = process.env.ENC_KEY
export const ACCESS_SECRET_USER_TOKEN = process.env.ACCESS_SECRET_USER_TOKEN
export const REFRESH_SECRET_USER_TOKEN = process.env.REFRESH_SECRET_USER_TOKEN
export const ACCESS_USER_EXPIRES_IN = process.env.ACCESS_USER_EXPIRES_IN
export const REFRESH_USER_EXPIRES_IN = process.env.REFRESH_USER_EXPIRES_IN

export const ACCESS_SECRET_ADMIN_TOKEN = process.env.ACCESS_SECRET_ADMIN_TOKEN
export const REFRESH_SECRET_ADMIN_TOKEN = process.env.REFRESH_SECRET_ADMIN_TOKEN
export const ACCESS_ADMIN_EXPIRES_IN = process.env.ACCESS_ADMIN_EXPIRES_IN
export const REFRESH_ADMIN_EXPIRES_IN = process.env.REFRESH_ADMIN_EXPIRES_IN
// Google
export const CLIENT_ID = process.env.CLIENT_ID