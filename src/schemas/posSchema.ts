import joi from "joi";

const posSchema = joi.object({
  cardId: joi.number().required(),
  amount: joi.number().required(),
});

export default posSchema;
