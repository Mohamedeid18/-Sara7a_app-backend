import { WHITE_LIST } from './../../config/configService.js';
export function corsOptions() {
const whiteList = WHITE_LIST.split(',');
const corsOptions = {
    origin: function (origin, cb) {
        if (whiteList.includes(origin)) {
            cb(null, true );
        }else if (!origin) { // postman |curl |apiDog =>null ,undefined
            cb(null,  true );
        } else {
            cb(new Error('Not allowed by CORS'));
        }
      },
      methods:['GET', 'POST', 'PATCH']
    }
    return corsOptions;
}