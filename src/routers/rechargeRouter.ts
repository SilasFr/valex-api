import { Router } from "express";
import { rechargeCard } from "../controllers/rechargeController.js";
import { validateApiKey } from "../middlewares/validateApiKey.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import rechargeSchema from "../schemas/rechargeSchemas.js";

const rechargeRouter = Router();

rechargeRouter.post(
  "/recharge/:id",
  validateApiKey,
  validateSchema(rechargeSchema),
  rechargeCard
);

export default rechargeRouter;
