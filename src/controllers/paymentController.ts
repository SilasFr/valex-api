import { NextFunction, Request, Response } from "express";
import * as paymentServices from "../services/paymentServices.js";
import * as errorUtils from "../utils/errorUtils.js";

export async function buy(req: Request, res: Response, next: NextFunction) {
  const { cardId, amount } = res.locals.verified;
  const { posId } = req.params;

  if (amount <= 0) {
    throw errorUtils.forbidenError("The payment amount cannot be 0 or lower");
  }
  await paymentServices.buy(cardId, amount, parseInt(posId));

  res.sendStatus(200);
}
