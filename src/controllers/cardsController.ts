import { Request, Response } from "express"
import * as cardsService from "../services/cardsService"

export async function CreateCard(req: Request, res: Response){

    const companyApiKey: any = req.headers["x-api-key"];        
    const { employeeId, typeCard }: { employeeId: number; typeCard: string } = req.body;

    const result = await cardsService.CreateCard(companyApiKey, typeCard, employeeId)
    res.send(result).status(200)

}