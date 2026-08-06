import { WHITE_LIST } from './../../config/configService.js';
export function corsOptionsDelegate(req, cb) {
const whiteList = WHITE_LIST.split(',');
const corsOptions = {
    origin: function (origin, cb) {
        if (whiteList.includes(origin)) {
            cb(null, { origin: true });
        }else if (!origin) { // postman |curl |apiDog =>null ,undefined
            cb(null, { origin: true });
        } else {
            cb(new Error('Not allowed by CORS'));
        }
      },
      methods:['GET', 'POST', 'PATCH']
    }
    return corsOptions;
}