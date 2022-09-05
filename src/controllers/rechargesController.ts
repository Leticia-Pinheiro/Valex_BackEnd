import { Request, Response } from "express"
import * as rechargesService from "../services/rechargesService"

export async function CreateRecharge(req: Request, res: Response){
    const companyApiKey: string = res.locals.header
    const { number, amount } 
    : { number : string, amount: number } = res.locals.body
    const result = await rechargesService.CreateRecharge(companyApiKey, number, amount)

    res.send(result).status(200)   
}