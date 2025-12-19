import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

const validateRequestData = (schema: ZodObject<ZodRawShape>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).send({
                success: false,
                error: parsed.error.issues
            })
        }

        req.body = parsed.data
        next()
    }
}

export default validateRequestData