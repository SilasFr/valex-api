import joi from "joi";

export const cardSchema = joi.object({
  employeeId: joi.number().required(),
  type: joi.alternatives(
    "groceries",
    "restaurants",
    "transport",
    "education",
    "health"
  ),
});

export const activateCardSchema = joi.object({
  password: joi.string().required(),
  securityCode: joi.string().required(),
});
