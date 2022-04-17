import { NextFunction, Request, Response } from "express";
import * as errorUtils from "../utils/errorUtils.js";
import * as rechargeServices from "../services/rechargeServices.js";

export async function rechargeCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { amount } = res.locals.verified;
  if (amount <= 0) {
    throw errorUtils.forbidenError("The amount must be more than 0");
  }

  await rechargeServices.recharge(parseInt(id), amount);

  res.status(200).send("ok");
}
