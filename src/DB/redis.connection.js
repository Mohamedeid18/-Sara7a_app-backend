import {createClient} from 'redis'
import { REDIS_URI } from '../config/configService.js'

export const redisClient = createClient({
    url:REDIS_URI
})

export const redisConnection = async ()=>{
    try {
        await redisClient.connect()
        console.log("Redis Connection Successfully")
    } catch (error) {
        console.error('Redis Connection Failed:',error)
    }
}
