import { NextFunction, Request, Response } from "express";

export async function buy(req: Request, res: Response, next: NextFunction) {
  console.log("body: ", req.body);
  console.log("params: ", req.params.id);
}
