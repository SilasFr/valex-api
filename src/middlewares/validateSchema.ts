import { NextFunction, Request, Response } from "express";

export async function validateSchema(schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      throw { type: "unprocessable_entity", message: error.details[0] };
    }
    res.locals.verified = req.body;
    next();
  };
}
