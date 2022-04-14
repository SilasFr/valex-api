import joi from "joi";

const activateCardSchema = joi.object({
  password: joi.string().required(),
  securityCode: joi.string().required(),
});

export default activateCardSchema;
