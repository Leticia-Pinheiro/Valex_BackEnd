import * as paymentsRepository from "../repositories/paymentsRepository"
import * as validationService from "./validationService"

export async function CreatePayment(
    number: string, 
    password: string, 
    businessName: string, 
    amount: number){

    const { cardId, businessId } = await validationService.ValidateToCreatePayment(number, password, businessName, amount)

    await paymentsRepository.CreatePayment(cardId, businessId, amount)    

    return {
        cardId,
        businessId,
        amount
    }
}