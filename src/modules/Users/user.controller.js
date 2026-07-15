import { Router } from "express";
import * as userServices from './user.service.js';
import { authenticateToken ,authorization } from "../../middleware/authentication.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";

const router = Router();

router.get('/profile', authenticateToken({tokenType: TokenTypeEnum.ACCESS}),authorization({accessRoles: [RoleEnum.USER, RoleEnum.ADMIN]}), userServices.getProfile);

export default router;