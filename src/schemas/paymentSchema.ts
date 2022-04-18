import joi from "joi";

const paymentSchema = joi.object({
  cardId: joi.number().required(),
  amount: joi.number().required(),
});

export default paymentSchema;
