import { Router } from "express";
import {
  activateCard,
  createNewCard,
  getExtract,
} from "../controllers/cardsController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { cardSchema, activateCardSchema } from "../schemas/cardSchemas.js";

const cardsRouter = Router();

cardsRouter.post("/cards", validateSchema(cardSchema), createNewCard);
cardsRouter.post(
  "/cards/:id/activate",
  validateSchema(activateCardSchema),
  activateCard
);
cardsRouter.get("/cards/:id/extract", getExtract);
export default cardsRouter;
