import { Router } from "express"
import * as cardsController from "../controllers/cardsController"
import HeaderMiddleware from "../middlewares/headerMiddleware"
import ValidateSchema from "../middlewares/validateSchemaMiddleware"
import CardSchema from "../schemas/cardSchema"

const cardsRouter = Router()
const endpoint = "/card"
const header = "x-api-key"

cardsRouter.post(
	"/create",
	HeaderMiddleware(header, endpoint),
	ValidateSchema(CardSchema, `${endpoint}/create`),
	cardsController.CreateCard
);

export default cardsRouter 