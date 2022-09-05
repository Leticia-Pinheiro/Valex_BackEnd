import * as cardsRepository from "../repositories/cardsRepository"
import * as validationService from "./validationService"
import { TransactionTypes , Card } from "../utils/types"
import { faker } from "@faker-js/faker"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat.js"
import { EncryptData, DecryptData } from "../utils/cryptr"
dayjs.extend(customParseFormat)


export async function CreateCard(
    companyApiKey: string, 
    typeCard: TransactionTypes, 
    employeeId: number){    
    
    const { fullName } = await validationService.ValidateToCreateCard(companyApiKey, employeeId, typeCard)     
    
    const cardData = GenerateCardData(employeeId, fullName, typeCard)
    const { number, cardholderName, cardExpirationDate, type, securityCode} = cardData
    await cardsRepository.CreateCard(cardData)
    const cardCvv : string = DecryptData(securityCode) 

    return {
        number,
        cardholderName, 
        cardCvv,
        cardExpirationDate,
        type
    }
}

export function GenerateCardData(
    employeeId : number,
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
    const securityCode : string = EncryptData(cardCvv)
    return  securityCode 
}

export function CreateCardholderName(
    fullName: string){

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
    const cardExpirationDate : string = dayjs(date).add(expirationCardDate, "year").format("MM/YY")
    return cardExpirationDate
}

//------------------------------------------------------------------------

export async function ActivateCard(
    number : string, 
    securityCode : string,
    password : string){

    await validationService.ValidateToActivateCard(number, securityCode)
    
    const passwordCrypt: string = EncryptData(password)

    await cardsRepository.ActivateCard(number, passwordCrypt)

    return "Card activated successfully"
}

//------------------------------------------------------------------------

export async function BlockCard(
    number: string, 
    informedPassword: string){

    const { isBlocked } = await validationService.ValidateToBlockOrUnlockCard(number, informedPassword)
    await validationService.ValidateToBlockCard(isBlocked)    

    await cardsRepository.BlockCard(number)

    return "Card blocked successfully"
}

export async function UnlockCard(
    number: string, 
    informedPassword: string){

    const { isBlocked } = await validationService.ValidateToBlockOrUnlockCard(number, informedPassword)
    await validationService.ValidateToUnlockCard(isBlocked)    

    await cardsRepository.UnlockCard(number)

    return "Card unlocked successfully"

}

//------------------------------------------------------------------------

export async function GetTransactions(
    cardId: number){

    await validationService.ValidateToGetTransactions(cardId)

    const rechargesData = await cardsRepository.GetRecharges(cardId)
    const transactionData = await cardsRepository.GetTransaction(cardId)
    const { balance } = await cardsRepository.GetBalance(cardId)

    return {
        "balance" : balance,
        "transactions": transactionData,
        "recharges": rechargesData
    }
}