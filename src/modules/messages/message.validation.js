import Joi from "joi";
import { Types } from "mongoose";

export const sendMessageValidation = {
    body: Joi.object({
        content: Joi.string().min(2).max(500).required().messages({
            'string.max': 'Content must be at most 500 characters long',
            'string.empty': 'message content is not allowed to be empty'
        })
    }),
    params: Joi.object({
        receiverId: Joi.string().required().custom((value, helpers) => {
            return Types.ObjectId.isValid(value) || helpers.error('Invalid receiver ID format');
        })
    })
}

export const toggleIsReadOrFavoriteValidation = {
    params: Joi.object({
        messageId: Joi.string().required().custom((value, helpers) => {
            return Types.ObjectId.isValid(value) || helpers.error('Invalid message ID format');
        })
    })
}