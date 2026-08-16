import { Router } from "express";
import * as authServices from './auth.service.js';
import * as authValidate from './auth.validation.js'
import { authenticateToken } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { validation } from "../../middleware/validation.middleware.js";

const router = Router();

router.post('/signup', validation(authValidate.signupSchema), authServices.signup);
router.post('/login', validation(authValidate.loginSchema), authServices.login);
router.patch('/confirm-email', validation(authValidate.confirmEmailSchema), authServices.confirmEmail);
router.patch('/forget-password', validation(authValidate.forgetPasswordSchema), authServices.forgetPassword);
router.patch('/reset-password', validation(authValidate.resetPasswordSchema), authServices.resetPassword);
router.post('/refresh-token',authenticateToken({tokenType:TokenTypeEnum.REFRESH}),authServices.refreshToken);
//remember me 
// router.post('/remember-me', authenticateToken({tokenType: TokenTypeEnum.ACCESS}), authServices.rememberMe);
router.post('/social-login', authServices.socialLogin);
router.post('/logout', authenticateToken({tokenType: TokenTypeEnum.ACCESS}), authServices.logout);
export default router;