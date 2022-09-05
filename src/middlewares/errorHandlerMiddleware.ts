import { NextFunction, Request, Response } from "express";
import AppError from "../utils/error"

export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.code === "Bad Request") return res.status(400).send(error.message);
  if (error.code === "Unauthorized") return res.status(401).send(error.message);
  if (error.code === "Not Found") return res.status(404).send(error.message);
  if (error.code === "Conflict") return res.status(409).send(error.message);
  if (error.code === "Invalid Input") return res.status(422).send(error.message);

  return res.sendStatus(500);
}

export default errorHandler