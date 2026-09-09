import express from 'express'
import { bootstrap } from './src/app.controller.js'
import { PORT } from './src/config/configService.js'
import chalk from 'chalk'
const app = express()
const port = PORT || 80

await bootstrap(app, express)

app.listen(port, () => console.log(chalk.bgRgb(75, 100, 100)(`Server is running on ${chalk.yellow(`http://localhost:${port}`)}`)))