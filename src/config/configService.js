import dotenv from 'dotenv'
import {resolve} from 'node:path'

export const NODE_ENV = process.env.NODE_ENV || 'development'

const envPath = {
    development:"dev.env",
    staging:"stag.env",
    production:"prod.env"
}

dotenv.config({ path: resolve(`./src/config/${envPath.development}`) })

export const PORT = process.env.PORT || 5000
export const DB_URL = process.env.DB_URL;