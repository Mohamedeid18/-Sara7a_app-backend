import fs from 'node:fs'
import path from 'node:path'
import morgan from 'morgan'

const __dirname = path.resolve();

export const attachRouteWithLogger = (app , routerPath , router ,logFileName)=>{
   const logStream = fs.createWriteStream(
    path.resolve(__dirname,'./src/loggers',logFileName),
    {flags:'a'}
   );
   app.use(routerPath,
    morgan('combined',{stream:logStream}),
    router
   )
}