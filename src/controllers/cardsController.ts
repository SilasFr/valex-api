import { NextFunction, Request, Response } from "express";
import * as cardService from "../services/cardsServices.js";

export async function createNewCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { employeeId, type } = res.locals.verified;

  const apiKey = req.headers["x-api-key"].toString();

  const createCard = cardService.createCard(employeeId, type, apiKey);

  res.sendStatus(201);
}
