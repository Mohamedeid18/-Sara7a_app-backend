import { GenderEnum, ProviderEnum, RoleEnum } from "../Utils/enums/user.enum.js";
import { badRequestException } from "../Utils/response/error.response.js";
import joi from "joi";
export const generalField = {
    userName: joi.string().min(2).max(25).messages({
            'any.required': 'userName is required',
            'string.min': 'userName must be at least 2 characters long',
            'string.max': 'userName must be at most 25 characters long'
        }),
        email: joi.string().email({
            minDomainSegments:2,
            maxDomainSegments:5,
            tlds:{allow:["com", "net", "org", "eg"]}
        }),
        password: joi.string().alphanum().messages({
            'any.required': 'Password is required',
            'string.alphanum': 'Password must be alphanumeric'
        }),
        confirmPassword: joi.string().valid(joi.ref('password')).messages({
            'any.only': 'Passwords do not match'
        }),
        phone: joi.string().pattern(/^(\+20|\+020|0)?1[0125][0-9]{8}$/).messages({
            'any.required': 'Phone number is required',
            'string.pattern.base': 'Please provide a valid egyptian phone number'
        }),
        role:joi.string().valid(...Object.values(RoleEnum)),
        gender:joi.string().valid(...Object.values(GenderEnum)),
        provider:joi.string().valid(...Object.values(ProviderEnum)),
        DOB: joi.string().isoDate(),
        confirmEmail: joi.string().isoDate(),
        profileImage: joi.string(),
        coverImages:joi.array().items(joi.string())
}
export const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            const validationResult = schema[key].validate(req[key], { abortEarly: false });
            if (validationResult.error) {
                validationErrors.push({ key, details: validationResult.error.details });
            }
            if(validationErrors.length) 
                throw badRequestException("Validation errors found", validationErrors);
            return next();
        }
    };
};