import { NextFunction, Request, Response } from "express";

export async function createNewCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const card = res.locals.verified;
  console.log("card: ", card);

  res.sendStatus(201);
}
