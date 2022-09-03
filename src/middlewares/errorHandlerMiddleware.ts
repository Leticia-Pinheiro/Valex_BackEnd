import { Request, Response, NextFunction } from "express"
import AppError from "../config/error"

function errorHandler(
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { log, statusCode, message, detail } = error

	return error instanceof AppError
		? res.status(statusCode).send({ message, detail })
		: res.status(500).send({
				message: `Internal server error`,
				detail: error,
		  });
}

export default errorHandler