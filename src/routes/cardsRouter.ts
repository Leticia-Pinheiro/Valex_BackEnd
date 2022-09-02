import { Router } from "express"
import { CreateCard } from "../controllers/cardsController"

const cardsRouter = Router()

cardsRouter.post('/cards', CreateCard)

export default cardsRouter 