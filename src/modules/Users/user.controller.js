import { Router } from "express";
import * as userServices from "./user.service.js";
import {
  authenticateToken,
  authorization,
} from "../../middleware/authentication.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { fileValidation, localFileUpload } from "./../../Utils/multer/local.multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as userValidate from "./user.validation.js";

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
//profile image from cloudinary
router.patch(
  "/upload-profile-image-cloud",
  authenticateToken({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  localFileUpload({ customDestination: "User", validation: [...fileValidation.images, ...fileValidation.videos] }).single("attachments"),
  userServices.getProfileImageCloud,
);

router.patch(
  "/upload-password",
  authenticateToken({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  validation(userValidate.updatePasswordSchema),
  userServices.updatePassword,
);
router.patch(
  "{/:userId}/freeze-account",
  authenticateToken({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  validation(userValidate.freezeAccountSchema),
  userServices.freezeAccount,
);
router.patch(
  "{/:userId}/restore-account",
  authenticateToken({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  validation(userValidate.restoredAccountSchema),
  userServices.restoredAccount,
);
router.patch(
  "/:userId/hard-delete-account",
  authenticateToken({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.ADMIN] }),
  validation(userValidate.hardDeleteAccountSchema),
  userServices.hardDeleteAccount,
);

export default router;
