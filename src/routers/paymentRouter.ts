import { Router } from "express";
import { buy } from "../controllers/paymentController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import paymentSchema from "../schemas/paymentSchema.js";

const paymentRouter = Router();

paymentRouter.post("/payment/:posId", validateSchema(paymentSchema), buy);

export default paymentRouter;
