import { Router } from "express";
import { buy } from "../controllers/posController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import posSchema from "../schemas/posSchema.js";

const POSRouter = Router();

POSRouter.post("/pos/:id", validateSchema(posSchema), buy);

export default POSRouter;
