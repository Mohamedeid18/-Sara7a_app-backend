import joi from 'joi'
import { Types } from 'mongoose';
export const updatePasswordSchema = {
    body:joi.object({
    oldPassword:joi.string().required(),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('newPassword')).messages({
                'any.only': 'Passwords do not match'
            })
})
}
export const freezeAccountSchema = {
    params:joi.object({
    userId:joi.string().custom((value, helpers) => {
        return (
            Types.ObjectId.isValid(value) || 
            helpers.message('Invalid user ID')
        );
    })
})
}
export const restoredAccountSchema = {
    params:joi.object({
    userId:joi.string().custom((value, helpers) => {
        return (
            Types.ObjectId.isValid(value) || 
            helpers.message('Invalid user ID')
        );
    })
})
}
export const hardDeleteAccountSchema = {
    params:joi.object({
    userId:joi.string().custom((value, helpers) => {
        return (
            Types.ObjectId.isValid(value) || 
            helpers.message('Invalid user ID')
        );
    })
})
}