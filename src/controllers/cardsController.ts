import { Request, Response } from "express"
import { CardTypes } from "../types/cardTypes";
import * as cardsService from "../services/cardsService"

export async function CreateCard(req: Request, res: Response){

    const companyApiKey: any = req.headers["x-api-key"]      
    const { employeeId, typeCard }: { employeeId: number; typeCard: CardTypes } = req.body
    const cardData = await cardsService.CreateCard(companyApiKey, typeCard, employeeId)

    res.send(cardData).status(200)   

}