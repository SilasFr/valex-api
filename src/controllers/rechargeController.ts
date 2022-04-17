import { NextFunction, Request, Response } from "express";

export async function rechargeCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const amount = res.locals.verified;
  res.status(200).send("ok");
}
