import { NextFunction, Request, Response } from "express";
import * as posServices from "../services/paymentServices.js";

export async function buy(req: Request, res: Response, next: NextFunction) {
  const cardInfo = res.locals.verified;
  const { posId } = req.params;

  res.sendStatus(200);
}
