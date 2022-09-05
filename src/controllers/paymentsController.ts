import { Request, Response } from "express"
import * as paymentsService from "../services/paymentsService"

export async function CreatePayment(req: Request, res: Response){    
    const { number, password, businessName, amount } 
    : { number : string, password : string, businessName : string, amount: number } = res.locals.body
    const result = await paymentsService.CreatePayment(number, password, businessName, amount)

    res.send(result).status(200)   
}