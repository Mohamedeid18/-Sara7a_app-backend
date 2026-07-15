import { Router } from "express";
import * as authServices from './auth.service.js';
import { authenticateToken } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enum.js";

const router = Router();

router.post('/signup', authServices.signup);
router.post('/login', authServices.login);
router.post('/refresh-token',authenticateToken({tokenType:TokenTypeEnum.REFRESH}),authServices.refreshToken);
//remember me 
// router.post('/remember-me', authenticateToken({tokenType: TokenTypeEnum.ACCESS}), authServices.rememberMe);
router.post('/social-login', authServices.socialLogin);
export default router;