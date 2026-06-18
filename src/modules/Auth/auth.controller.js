import { Router } from "express";
import * as authServices from './auth.service.js';

const router = Router();

router.get('/', authServices.authTest);

export default router;