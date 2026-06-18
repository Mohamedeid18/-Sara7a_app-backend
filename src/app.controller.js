import connectDB from './DB/connection.js'
import {authRouter,messageRouter,userRouter} from './modules/index.js'
import { globalErrorHandler, notFoundException } from "./Utils/response/error.response.js"
import { successResponse } from "./Utils/response/success.response.js"
export  const bootstrap = async (app,express) => {
    app.use(express.json())
    await connectDB();

    app.get('/', (req, res) => successResponse({res, message: 'Welcome to the API'}))

    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/message', messageRouter)

    app.all('/*dummy', (req, res) => notFoundException('Not Found Handler!!'))

    app.use(globalErrorHandler);
}