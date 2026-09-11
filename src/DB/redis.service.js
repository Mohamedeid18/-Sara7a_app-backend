import {  notFoundException } from "../Utils/response/error.response.js";
import { redisClient } from "./redis.connection.js";

export const revokeTokenPrefix = ({userId}) => `user:revokeToken:${userId}`;
export const revokeToken = ({userId, jti})=>{
    return `${revokeTokenPrefix({userId})}:${jti}`
}
export const setKey = async({key, value, ttl = null})=>{
    try {
        const data = typeof value != "string" ? JSON.stringify(value) : value;
        if(ttl) {
            await redisClient.set(key,data,{
                expiration:{type: "EX", value: ttl}
            });
        } else {
            await redisClient.set(key,data);
        }
    } catch (error) {
        console.error("Error setting Redis key:", error);
    }
}
export const getKey = async({key})=>{
    try {
        const data = await redisClient.get(key);
        return data
    } catch (error) {
        console.error("Error getting Redis key:", error);
    }
}
export const updateKey = async({key, value, ttl = null})=>{
    try{
        const isExist = await redisClient.exists(key);
        if(!isExist) {
            throw notFoundException('Key not found');
        }
        const data = typeof value != "string" ? JSON.stringify(value) : value;
        if(ttl) {
            await redisClient.set(key,data,{
                expiration:{type: "EX", value: ttl}
            });
        } else {
            await redisClient.set(key,data);
        }
    }catch (error) {
        console.error("Error updating Redis key:", error);
    }
}
export const deleteKey = async({key})=>{
    try{
        const isExist = await redisClient.exists(key);
        if(!isExist) {
            throw notFoundException('Key not found');
        }
        await redisClient.del(key);
    }catch (error) {
        console.error("Error deleting Redis key:", error);
    }
}
export const expireKey = async({key, ttl})=>{
    try{
        const isExist = await redisClient.exists(key);
        if(!isExist) {
            throw notFoundException('Key not found');
        }
        await redisClient.expire(key, ttl);
    }catch (error) {
        console.error("Error expiring Redis key:", error);
    }
}
export const ttl = async({key})=>{
    try{
        const isExist = await redisClient.exists(key);
        if(!isExist) {
            throw notFoundException('Key not found');
        }
        return await redisClient.ttl(key);
    }catch (error) {
        console.error("Error getting TTL of Redis key:", error);
    }
}
export const keys = async({pattern = "*"})=>{
    try{
        return await redisClient.keys(pattern);
    }catch (error) {
        console.error("Error getting Redis keys:", error);
    }
}