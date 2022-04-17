import { Router } from "express";
import { validateApiKey } from "../middlewares/validateApiKey";

const rechargeRouter = Router();

rechargeRouter.post("/recharge/:id", validateApiKey);

export default rechargeRouter;
