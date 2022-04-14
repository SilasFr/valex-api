import { Router } from "express";
import { createNewCard } from "../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/cards", createNewCard);

export default cardsRouter;
