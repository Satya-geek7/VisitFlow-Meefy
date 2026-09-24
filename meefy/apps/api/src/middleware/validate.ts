/**
 * Zod request validation middleware
 * Validates request body, params, or query against Zod schemas
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err = result.error as ZodError;
      res.status(400).json({
        success: false,
        error: err.errors[0]?.message || "Validation failed",
        fieldErrors: err.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};
