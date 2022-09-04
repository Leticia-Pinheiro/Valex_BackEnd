import { Request, Response } from "express"
import { TransactionTypes } from "../utils/types"
import * as cardsService from "../services/cardsService"

export async function CreateCard(req: Request, res: Response){

    const companyApiKey: any = req.headers["x-api-key"]      
    const { employeeId, typeCard }: { employeeId: number; typeCard: TransactionTypes } = req.body
    const cardData = await cardsService.CreateCard(companyApiKey, typeCard, employeeId)
    
    res.send(cardData).status(200)   
}

export async function ActivateCard(req: Request, res: Response){
    const { number, securityCode, password } 
    : { number : string, securityCode : string, password: string } = req.body

    const result = await cardsService.ActivateCard(number, securityCode, password)
    
    res.send(result).status(200)
}

export async function GetTransactions(req: Request, res: Response){
    const {cardId} : {cardId : number} = req.body

    const result = await cardsService.GetTransactions(cardId)

    res.send(result).status(200)
}

export async function BlockCard(req: Request, res: Response){
    const { number, password } :
    {number: string, password: string} = req.body

    const result = await cardsService.BlockCard(number, password)

    res.send(result).status(200)

}

export async function UnlockCard(req: Request, res: Response){
    const { number, password } :
    {number: string, password: string} = req.body

    const result = await cardsService.UnlockCard(number, password)

    res.send(result).status(200)

}