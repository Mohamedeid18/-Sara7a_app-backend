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
export const confirmEmailSchema = {
    body:joi.object({
    email: generalField.email.required(),
    otp: joi.string().pattern(/^\d{6}$/).required()
})
}

export const forgetPasswordSchema = {
    body:joi.object({
    email: generalField.email.required()
})
}
export const resetPasswordSchema = {
    body:joi.object({
    email: generalField.email.required(),
    otp: joi.string().pattern(/^\d{6}$/).required(),
    newPassword: generalField.password.required(),
    confirmPassword: joi.string().valid(joi.ref('newPassword')).messages({
                'any.only': 'Passwords do not match'
            })
})
}
export const resendOTPSchema = {
    body:joi.object({
    email: generalField.email.required(),
    type: joi.string().valid("CONFIRM_EMAIL", "FORGET_PASSWORD").required()
})
}