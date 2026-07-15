//throw new Error

import { NODE_ENV } from "../../config/configService.js";

export const errorResponse = ({status = 400, message = "Error",extra = undefined}) => {
    const error = new Error(typeof message === "string" ? message : message?.message);
    error.status = status;
    error.extra = extra;
    throw error;
};

export const badRequestException = (message = "Bad Request", extra = undefined) => {
    return errorResponse({ status: 400, message, extra });
};

export const unauthorizedException = (message = "Unauthorized", extra = undefined) => {
    return errorResponse({ status: 401, message, extra });
};

export const forbiddenException = (message = "Forbidden", extra = undefined) => {
    return errorResponse({ status: 403, message, extra });
};

export const notFoundException = (message = "Not Found", extra = undefined) => {
    return errorResponse({ status: 404, message, extra });
};

export const conflictException = (message = "Conflict", extra = undefined) => {
    return errorResponse({ status: 409, message, extra });
};

export const toManyException = (message = "Too Many Requests", extra = undefined) => {
    return errorResponse({ status: 429, message, extra });
};

export const internalServerException = (message = "Internal Server Error", extra = undefined) => {
    return errorResponse({ status: 500, message, extra });
};

export const globalErrorHandler = (err, req, res, next) => {
    const status = err.status ?? 500;
    res.status(status).json({ message: err.message, stack: NODE_ENV === 'development' ? err.stack : undefined, status });
};