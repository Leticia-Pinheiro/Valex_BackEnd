import { Router } from "express"
import * as cardsController from "../controllers/cardsController"

const cardsRouter = Router()
cardsRouter.post("/card", cardsController.CreateCard)

export default cardsRouter 