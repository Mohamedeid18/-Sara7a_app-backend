import helmet from 'helmet'
import connectDB from './DB/connection.js'
import {authRouter,messageRouter,userRouter} from './modules/index.js'
import { globalErrorHandler, notFoundException } from "./Utils/response/error.response.js"
import cors from "cors"
import path from 'node:path'
import { corsOptions } from './Utils/cors/cors.utils.js'
import { attachRouteWithLogger } from './Utils/loggers/morgan.loggers.js'

import { redisConnection } from './DB/redis.connection.js'
import { customRateLimit } from './middleware/RateLimit.middleware.js'

export  const bootstrap = async (app,express) => {
    app.use(express.json(), cors(corsOptions()),helmet(),customRateLimit())
    await connectDB();
    await redisConnection();
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