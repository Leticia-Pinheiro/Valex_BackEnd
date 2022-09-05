import * as rechargesRepository from "../repositories/rechargesRepository"
import * as validationService from "./validationService"

export async function CreateRecharge(
    companyApiKey: string,
    number: string,
    amount: number){

    const { id } = await validationService.ValidateToCreateRecharge(companyApiKey, number)

    await rechargesRepository.CreateRecharge(id, amount)

    return {
        cardId: id,
        amount
    }
}