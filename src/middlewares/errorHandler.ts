import { Request, Response, NextFunction } from "express";
import "express-async-errors";

export function errorHandler(
  error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.type === "unprocessable_entity") {
    return res.status(422).send(error.message);
  }

  if (error.type === "not_found") {
    return res.status(404).send(error.message);
  }

  if (error.type === "forbiden") {
    return res.status(409).send(error.message);
  }
  res.status(500).send(error);
}
