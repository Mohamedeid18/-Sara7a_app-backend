import helmet from 'helmet'
import connectDB from './DB/connection.js'
import {authRouter,messageRouter,userRouter} from './modules/index.js'
import { globalErrorHandler, notFoundException } from "./Utils/response/error.response.js"
import { successResponse } from "./Utils/response/success.response.js"
import cors from "cors"
import path from 'node:path'
import { corsOptions } from './Utils/cors/cors.utils.js'
import { attachRouteWithLogger } from './Utils/loggers/morgan.loggers.js'
import rateLimit from 'express-rate-limit'
import { redisConnection } from './DB/redis.connection.js'
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: 15, // limit each IP to 15 requests per windowMs
    handler:(req, res) => {
        res.status(429).json({ message: 'Too many requests from this IP, please try again later.' });
    },
    legacyHeaders:false
})
export  const bootstrap = async (app,express) => {
    app.use(express.json(), cors(corsOptions()),helmet(),limiter)
    await connectDB();
    // await redisConnection();
    // All Router + Router special File
    const routes = [
        { path: '/api/v1/auth', router: authRouter, logFile: "access.log" },
        { path: '/api/v1/user', router: userRouter, logFile: "access.log" },
        { path: '/api/v1/message', router: messageRouter, logFile: "access.log" }
    ]
    routes.forEach(({ path, router, logFile }) => {
        attachRouteWithLogger(app, path, router, logFile)
    })
    app.use("/uploads", express.static(path.resolve('./src/uploads')))
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/message', messageRouter)

    app.all('/*dummy', (req, res) => notFoundException('Not Found Handler!!'))

    app.use(globalErrorHandler);
}