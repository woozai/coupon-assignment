import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Validation errors returned by express-validator can come in different shapes.
// This helper normalizes every error into a consistent response format.
type ValidationErrorShape = {
    msg: string;
    param?: string;
    location?: string;
};

const formatValidationError = (error: unknown) => {
    const typedError = error as ValidationErrorShape;
    const field =
        typeof typedError.param === "string" ? typedError.param
            : typeof typedError.location === "string"
                ? typedError.location
                : "body";

    return {
        field,
        message: typedError.msg ?? "Invalid request",
    };
};

// Middleware that checks for validation errors after request validators run.
// If any errors exist, respond with HTTP 400 and a normalized error list.
export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(formatValidationError),
        });
    }

    next();
};
