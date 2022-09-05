import { Router } from "express"
import * as paymentsController from "../controllers/paymentsController"
import ValidateSchema from "../middlewares/validateSchemaMiddleware"
import PaymentSchema from "../schemas/paymentsSchema"

const paymentsRouter = Router()
const endpoint = "/payment"
const header = "x-api-key"

paymentsRouter.post(
	"/createPayment",	
	ValidateSchema(PaymentSchema, `${endpoint}/createPayment`),
	paymentsController.CreatePayment
)

export default paymentsRouter 