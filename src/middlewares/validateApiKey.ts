import { NextFunction, Request, Response } from "express";
import * as errorUtils from "../utils/errorUtils.js";
import * as apiKeyService from "../services/apiKeyServices";

export async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey: string = req.header["x-api-key"].toString();
  if (!apiKey) {
    throw errorUtils.forbidenError("Api key header is needed");
  }
  await apiKeyService.validate(apiKey);

  next();
}
