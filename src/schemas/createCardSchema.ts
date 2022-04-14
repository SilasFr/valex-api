import joi from "joi";

const cardSchema = joi.object({
  employeeId: joi.number().required(),
  type: joi.alternatives(
    "groceries",
    "restaurants",
    "transport",
    "education",
    "health"
  ),
});
export default cardSchema;
