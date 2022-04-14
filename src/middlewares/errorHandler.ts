import { Request, Response, NextFunction } from "express";

export function errorHandler(
  error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500).send(error);
}
