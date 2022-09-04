import { Request, Response, NextFunction } from "express"
import { Schema } from "joi"

import AppError from "../utils/error"

function ValidateSchema(schema: Schema, endpoint: string) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.validate(req.body, { abortEarly: false });

		if (result.error) {
			const { error } = result;
			throw new AppError(
				"Invalid Input",
				422,
				"Invalid Input",
				error.details.map((detail) => detail.message).join(", ")
			);
		}

		res.locals.body = req.body
		return next()
	};
}

export default ValidateSchema