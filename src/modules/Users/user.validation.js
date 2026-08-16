import joi from 'joi'
export const updatePasswordSchema = {
    body:joi.object({
    oldPassword:joi.string().required(),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('newPassword')).messages({
                'any.only': 'Passwords do not match'
            })
})
}