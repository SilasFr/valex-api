import { Router } from "express";
import { createNewCard } from "../controllers/cardsController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import cardSchema from "../schemas/createCardSchema.js";

const cardsRouter = Router();

cardsRouter.post("/cards", validateSchema(cardSchema), createNewCard);

export default cardsRouter;
