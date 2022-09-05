import { Request, Response, NextFunction } from "express"

function HeaderMiddleware(header: string, endpoint: string) {
	return (req: Request, res: Response, next: NextFunction) => {
		const data = req.header(header);

		if (!data) {			
			throw { code: "Bad Request", message: "Provide an Api Key" }
		}

		res.locals.header = data;
		return next();
	};
}

export default HeaderMiddleware;