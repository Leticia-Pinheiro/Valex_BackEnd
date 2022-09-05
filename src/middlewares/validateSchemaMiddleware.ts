import { Request, Response, NextFunction } from "express"
import { Schema } from "joi"

function ValidateSchema(schema: Schema, endpoint: string) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.validate(req.body, { abortEarly: false });		

		if(result.error){
			throw { code: "Invalid Input", message: "Invalid Input" };
		}

		res.locals.body = req.body
		return next()
	};
}

export default ValidateSchema