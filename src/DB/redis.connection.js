import {createClient} from 'redis'
import { REDIS_URI } from '../config/configService.js'

export const redisClient = createClient({
    url:REDIS_URI,
    socket:{
        reconnectStrategy:(retries)=>{
            if(retries >= 10) {
                console.log("Redis is trying to reconnect...")
                return new Error("redis reached max retries")
            }
            return Math.min(retries * 1000, 30000);
        }
    }
})
redisClient.on('error', (error) => {
    console.error('Redis Client Error:', error.message);
})

redisClient.on('reconnecting', () => {
    console.log('Redis is attempting to reconnect...');
})

export const redisConnection = async ()=>{
    try {
        await redisClient.connect()
        console.log("Redis Connection Successfully")
    } catch (error) {
        console.error('Redis Connection Failed:',error)
    }
}
