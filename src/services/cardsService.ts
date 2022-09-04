import * as cardsRepository from "../repositories/cardsRepository"
import * as validationService from "./validationService"
import { TransactionTypes , Card } from "../utils/types"
import AppError from "../utils/error"
import { faker } from "@faker-js/faker"
import Cryptr from "cryptr"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat.js"
dayjs.extend(customParseFormat)


export async function CreateCard(
    companyApiKey: string, 
    typeCard: TransactionTypes, 
    employeeId: number){
    
    const companyData = await validationService.ValidateApiKey(companyApiKey)  
    const employeeData = await validationService.ValidateEmployeeId(employeeId)    
    const { fullName, companyId } : {fullName: string, companyId: number} = employeeData
    const { id } : { id: number}= companyData
    await validationService.ValidateEmployeeHasTypeCard(employeeId, typeCard)  
    await validationService.ValidateRegisteredEmployee(id, companyId)     
    
    const cardData = GenerateCardData(employeeId, fullName, typeCard)  
    await cardsRepository.CreateCard(cardData)

    return cardData
}

export function GenerateCardData
    (employeeId : number,
    fullName: string, 
    typeCard: TransactionTypes){

    const cardNumber = CreateCardNumber()
    const securityCode =  CreateCardSecurityCode()
    const cardholderName = CreateCardholderName(fullName)
    const cardExpirationDate = CreateCardExpirationDate()
    const cardData : Card = { 
        employeeId,       
        number: cardNumber,            
        cardholderName,
        securityCode,
        cardExpirationDate,            
        isVirtual: false,            
        isBlocked: false,
        type: typeCard       
    }
    return cardData
}



export function CreateCardNumber(){    
    const cardNumber : string = faker.finance.creditCardNumber("#### #### #### ####") 
    return cardNumber   
}

export function CreateCardSecurityCode(){    
    const cardCvv : string = faker.finance.creditCardCVV()    
    const cryptr = new Cryptr("SecretKey");    
    const securityCode: string = cryptr.encrypt(cardCvv)
    return securityCode
}

export function CreateCardholderName(fullName: string){
    const regex = /^(d[a,e,o,i])$/
	const names = fullName.split(" ")    
	let cardholderName : string = ""

	if (names.length === 1) {
        cardholderName = names[0]
	} 
    else if (names.length === 2) {
		cardholderName = `${names[0]} ${names[1]}`
	} 
    else {
        const firstName = names[0]
		const lastName = names[names.length - 1]
		const half = Math.floor(names.length / 2)
		
		const middleName = regex.test(names[half])
			? names[half + 1] === lastName
				? names[half - 1]
				: names[half + 1]
			: names[half]

		cardholderName = `${firstName} ${middleName[0]} ${lastName}`
	}

	return cardholderName.toUpperCase()
}

export function CreateCardExpirationDate(){
    const expirationCardDate = 5
    const date = new Date()    
    const cardExpirationDate : string = dayjs(date).add(expirationCardDate, "year").format("MM/YY") //getCardExpirationDate
    
    return cardExpirationDate
}