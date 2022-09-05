import { Router } from "express"
import * as rechargesController from "../controllers/rechargesController"
import HeaderMiddleware from "../middlewares/headerMiddleware"
import ValidateSchema from "../middlewares/validateSchemaMiddleware"
import RechargeSchema from "../schemas/rechargesSchema"

const rechargesRouter = Router()
const endpoint = "/recharge"
const header = "x-api-key"

rechargesRouter.post(
	"/createRecharge",
	HeaderMiddleware(header, endpoint),
	ValidateSchema(RechargeSchema, `${endpoint}/createRecharge`),
	rechargesController.CreateRecharge
)

export default rechargesRouter 