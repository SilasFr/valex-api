import { NextFunction, Request, Response } from "express";
import * as cardService from "../services/cardsServices.js";

export async function createNewCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { employeeId, type } = res.locals.verified;

  const apiKey = req.headers["x-api-key"].toString();

  cardService.createCard(employeeId, type, apiKey);

  res.sendStatus(201);
}

export async function activateCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const cardData = res.locals.verified;
  cardData.id = id;

  await cardService.activateCard(cardData);

  res.sendStatus(200);
}

export async function getExtract(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id: cardId } = req.params;
  const extract = await cardService.getExtract(Number(cardId));

  res.status(200).send(extract);
}
