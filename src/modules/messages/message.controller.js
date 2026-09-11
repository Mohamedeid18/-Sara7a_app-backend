import { Router } from "express";
import * as messageServices from './message.service.js'
import * as messageValidation from './message.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
import { authenticateToken } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enum.js";

const router = Router();

router.post('/send-message/:receiverId',validation(messageValidation.sendMessageValidation), messageServices.sendMessage);
router.get('/', authenticateToken({tokenType:TokenTypeEnum.ACCESS}), messageServices.getMessages);
router.patch('/toggle-is-read/:messageId', validation(messageValidation.toggleIsReadOrFavoriteValidation), authenticateToken({tokenType:TokenTypeEnum.ACCESS}), messageServices.toggleIsRead);
router.patch('/toggle-is-favorite/:messageId', validation(messageValidation.toggleIsReadOrFavoriteValidation), authenticateToken({tokenType:TokenTypeEnum.ACCESS}), messageServices.toggleIsFavorite);
export default router;