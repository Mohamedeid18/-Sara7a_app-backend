import { Router } from "express";
import * as messageServices from './message.service.js'

const router = Router();

router.get('/', messageServices.messageTest);

export default router;