import { toManyRequestsException } from "../Utils/response/error.response.js";

const iPRequest = {};

const blockedIps = new Set();

const unBlockedTimer = new Map();

const RATE_LIMIT = 15; 
const WINDOWS_MS = 2 * 60 * 1000 ;

export const customRateLimit = () => {
    return (req, res, next) => {
        const ip = req.ip
        const current_time = Date.now()
        if(blockedIps.has(ip)) {
            throw toManyRequestsException("Too Many Requests , please try again later.");
        }
        if(!iPRequest[ip]) {
            iPRequest[ip] = {
                count:1,
                startTime: current_time
            }
            return next()
        } 
        const diff = current_time - iPRequest[ip].startTime;
        if(diff < WINDOWS_MS) {
            iPRequest[ip].count++;
            if(iPRequest[ip].count > RATE_LIMIT) {
                blockedIps.add(ip);
                if(!unBlockedTimer.has(ip)) {
                const timer = setTimeout(() => {
                    blockedIps.delete(ip);
                    unBlockedTimer.delete(ip);
                }, WINDOWS_MS);
                unBlockedTimer.set(ip, timer);
            }
                throw toManyRequestsException("Too Many Requests , please try again later.");
            }
        } else {
            iPRequest[ip] = {
                count:1,
                startTime: current_time
            };
        }
        next()
    }
}