/**
 * Async Handler Wrapper for Express Routes
 * Guarantees uncaught rejections are passed to next()
 * Follows RULES.md §6
 */

import { Request, Response, NextFunction } from "express";

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
