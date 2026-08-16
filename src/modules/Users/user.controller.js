import { Router } from "express";
import * as userServices from "./user.service.js";
import {
  authenticateToken,
  authorization,
} from "../../middleware/authentication.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { fileValidation, localFileUpload } from "./../../Utils/multer/local.multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as uservalidate from "./user.validation.js";

const router = Router();

router.get(
  "/profile",
  authenticateToken({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  userServices.getProfile,
);
router.patch(
  "/upload-file",
  authenticateToken({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  localFileUpload({ customDestination: "User", validation: [...fileValidation.images, ...fileValidation.videos] }).single("attachments"),
  userServices.getProfileImage,
);
router.patch(
  "/upload-cover-images",
  authenticateToken({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  localFileUpload({ customDestination: "User", validation: [...fileValidation.images] }).array("attachments", 5),
  userServices.getCoverImages,
);
router.patch(
  "/upload-password",
  authenticateToken({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  validation(uservalidate.updatePasswordSchema),
  userServices.updatePassword,
);

export default router;
