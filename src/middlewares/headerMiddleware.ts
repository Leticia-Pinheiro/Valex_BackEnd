import { Request, Response, NextFunction } from "express"

import AppError from "../config/error"

function HeaderMiddleware(header: string, endpoint: string) {
	return (req: Request, res: Response, next: NextFunction) => {
		const data = req.header(header);

		if (!data) {
			throw new AppError(
				"Missing headers",
				400,
				`Missing ${header} header`,
				"Ensure to provide the necessary headers"
			)
		}

		res.locals.header = data;
		return next();
	};
}

export default HeaderMiddleware;