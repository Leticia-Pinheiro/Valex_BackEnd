import * as cardsRepository from "../repositories/cardsRepository"
import * as validationService from "./validationService"
import { CardTypes } from "../types/cardTypes"
import AppError from "../config/error"

export async function CreateCard(
    companyApiKey: string, 
    typeCard: CardTypes, 
    employeeId: number){
    
    const companyData = await validationService.ValidateApiKey(companyApiKey)  
    const employeeData = await validationService.ValidateEmployeeId(employeeId)    
    await validationService.ValidateEmployeeHasTypeCard(employeeId, typeCard)  
    await validationService.ValidateRegisteredEmployee(companyData.id, employeeData.companyId)  
    
    
    
    
    return "ok"

}