import { NextFunction, Request, Response } from "express";

export async function createNewCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const card = res.locals.verified;
  const apiKey = req.headers["x-api-key"];

  res.sendStatus(201);
}
