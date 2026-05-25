import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';

type RequestPart = 'body' | 'params' | 'query';

const formatZodError = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

export const validate =
  (schema: ZodType, part: RequestPart = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: formatZodError(result.error),
      });
    }

    req[part] = result.data;
    next();
  };
