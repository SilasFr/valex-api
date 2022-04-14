import { Request, Response, NextFunction } from "express";

export function errorHandler(
  error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.type === "unprocessable_entity") {
    res.status(422).send(error.message);
  }
  console.log(error);
  res.status(500).send(error);
}
