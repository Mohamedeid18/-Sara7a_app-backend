import express from 'express'
import { bootstrap } from './src/app.controller.js'
import { PORT } from './src/config/configService.js'
const app = express()
const port = PORT || 80

await bootstrap(app, express)

app.listen(port, () => console.log(`server running on http://localhost:${port}`))