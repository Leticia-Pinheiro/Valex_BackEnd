import * as cardsRepository from "../repositories/cardsRepository"
import * as employeesRepository from "../repositories/employeesRepository"
import * as companiesRepository from "../repositories/companiesRepository"
import * as businessRepository from "../repositories/businessRepository"
import { TransactionTypes } from "../utils/types"
import { DecryptData } from "../utils/cryptr"
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export async function ValidateToCreateCard(
	companyApiKey: string, 
	employeeId: number, 
	typeCard: TransactionTypes){

	const { id } 
	: { id : number} = await ValidateCompanyApiKey(companyApiKey)  
	const { fullName, companyId } 
	: {fullName : string, companyId : number} = await ValidateEmployeeId(employeeId)

	await ValidateCompanyRegisteredEmployee(id, companyId)
	await ValidateEmployeeHasTypeCard(employeeId, typeCard)

	return { fullName }
}

export async function ValidateToActivateCard(
	number: string,
	securityCode: string){
	
	const cardData = await ValidateCardByNumber(number)
	await ValidateCardSecurityCode(securityCode, cardData.securityCode)
	await ValidateCardHasPassword(cardData.password)
	await ValidateCardExpirationDate(cardData.expirationDate)
}

export async function ValidateToBlockOrUnlockCard(
	number: string,
	informedPassword: string){

	const cardData = await ValidateCardByNumber(number)
	await ValidateCardExpirationDate(cardData.expirationDate)	
	await ValidateCardHasNoPassword(cardData.password)
	await ValidateCardPassword(informedPassword, cardData.password)	
	
	return cardData
}

export async function ValidateToBlockCard(
	isBlocked: boolean){

	if(isBlocked === true){
		throw { code: "Conflict", message: "Card is already blocked" }		
	}
}

export async function ValidateToUnlockCard(
	isBlocked: boolean){
		
	if(isBlocked === false){
		throw { code: "Conflict", message: "Card is already unlocked" }	
	}
}

export async function ValidateToGetTransactions(
	cardId: number){

	await ValidateCardById(cardId)
}

export async function ValidateToCreateRecharge(
	companyApiKey: string, 
	number: string){

	const cardData = await ValidateCardByNumber(number)	
	const { id } 
	: { id : number} = await ValidateCompanyApiKey(companyApiKey)
	const { companyId } 
	: {companyId : number} = await ValidateEmployeeId(cardData.employeeId)

	await ValidateCompanyRegisteredEmployee(id, companyId)
	await ValidateToBlockCard(cardData.isBlocked)
	await ValidateCardExpirationDate(cardData.expirationDate)

	return cardData
	
}

export async function ValidateToCreatePayment(
	number: string, 
    informedPassword: string, 
    businessName: string, 
    amount: number){

	const cardData = await ValidateCardByNumber(number)
	const cardId = cardData.id
	await ValidateToBlockCard(cardData.isBlocked)
	await ValidateCardExpirationDate(cardData.expirationDate)
	await ValidateCardPassword(informedPassword, cardData.password)

	const businessData = await ValidateBusinessByName(businessName)
	const businessId = businessData.id
	await ValidateTypeBusiness(businessData.type, cardData.type)
	await ValidateAmountPayment(amount, cardData.id)

	return { cardId, businessId }
}

//-----------------------------------------------------------------

export async function ValidateCompanyApiKey(
	companyApiKey : string){

    const result = await companiesRepository.SeachCompanyByApiKey(companyApiKey)

	if (!result) {
		throw { code: "Not Found", message: "Company Not Found" }	
	}
	
	return result;
}

export async function ValidateEmployeeId(
	employeeId : number){

    const result = await employeesRepository.SeachEmployeeById(employeeId)
    if (!result) {
		throw { code: "Not Found", message: "Employee Not Found"}	
	}
	return result;
}

export async function ValidateCompanyRegisteredEmployee(
	id: number, 
	companyId: number){
		
    if (id !== companyId){
        throw { code: "Not Found", message: "Employee Not Found"}
    }
}

export async function ValidateEmployeeHasTypeCard(
	employeeId: number, 
	typeCard: TransactionTypes){

    const result = await cardsRepository.SeachEmployeeCardByType(employeeId, typeCard)
    if (result) {
		throw { code: "Conflict", message: "Employee already has this type of card"}		
	}	
}

export async function ValidateCardByNumber(
	number: string){	

	const cardData = await cardsRepository.SearchCardByNumber(number)
	
	if(!cardData){
		throw { code: "Not Found", message: "Card not found"}
	}

	return cardData
}

export async function ValidateCardSecurityCode(
	securityCode: string,
	cardSecurityCode: string){

	const securityCodeDecrypt: string = DecryptData(cardSecurityCode)	

	if(securityCode !== securityCodeDecrypt){		
		throw { code: "Unauthorized", message: "Invalid security code"}
	}
}

export async function ValidateCardHasPassword(
	password: string){

	if (password){
		throw { code: "Conflict", message: "Activated card"}		
	}
}

export async function ValidateCardHasNoPassword(
	password: string){

	if(!password){
		throw { code: "Not Found", message: "Deactivated card"}		
	}
}

export async function ValidateCardExpirationDate(
	expirationDate: string){

	if(dayjs(new Date()).isAfter(dayjs(expirationDate, "MM/YY"))){
		throw { code: "Unauthorized", message: "Expired card"}		
	}
}

export async function ValidateCardById(
	cardId: number){
		
	const cardData = await cardsRepository.SearchCardById(cardId)

	if(!cardData){
		throw { code: "Not Found", message: "Card not found"}
	}	
}

export async function ValidateCardPassword(
	informedPassword: string, 
	password: string ){
	
	const passwordDecrypt: string = DecryptData(password)	

	if(informedPassword !== passwordDecrypt){		
		throw { code: "Unauthorized", message: "Incorrect password"}
	}
}

export async function ValidateBusinessByName(
	businessName: string){

	const businessData = await businessRepository.SearchBusinessByName(businessName)

	if(!businessData){
		throw { code: "Not Found", message: "Business not found"}
	}

	return businessData
}

export async function ValidateTypeBusiness(
	typeBusiness: string,
	typeCard: string){

	if(typeCard !== typeBusiness){
		throw { code: "Unauthorized", message: "Card not allowed"}
	}
}

export async function ValidateAmountPayment(
	amount: number,
	cardId: number){

	const { balance } = await cardsRepository.GetBalance(cardId)

	if(amount > balance){
		throw { code: "Unauthorized", message: "Insufficient funds"}
	}
}
