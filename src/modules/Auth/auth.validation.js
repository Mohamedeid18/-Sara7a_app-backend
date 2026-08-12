import joi from "joi";    
import { Types } from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../Utils/enums/user.enum.js";
import { generalField } from "../../middleware/validation.middleware.js";
export const signupSchema = {
    body:joi.object({
    userName: generalField.userName.required(),
    email: generalField.email.required(),
    password: generalField.password.required(),
    confirmPassword: generalField.confirmPassword.required(),
    phone: generalField.phone,
    role: generalField.role,
    gender: generalField.gender,
    provider: generalField.provider,
    DOB: generalField.DOB,
    confirmEmail: generalField.confirmEmail,
    profileImage: generalField.profileImage,
    coverImages: generalField.coverImages
})
}

export const loginSchema = {
    body:joi.object({
    email: generalField.email.required(),
    password: generalField.password.required()
})
}
