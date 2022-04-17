import { NextFunction, Request, Response } from "express";
// import * as rechargeRepo from "../services/rechargeServices.js";

export async function rechargeCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
}
