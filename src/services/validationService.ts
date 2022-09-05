import * as cardsRepository from "../repositories/cardsRepository"
import * as employeesRepository from "../repositories/employeesRepository"
import * as companiesRepository from "../repositories/companiesRepository"
import * as businessRepository from "../repositories/businessRepository"
import { TransactionTypes } from "../utils/types"
import AppError from "../utils/error"
import Cryptr from "cryptr"

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

	console.log(securityCode) //tirar
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
		throw new AppError(
			"Blocked Card",
			409,
			"Blocked Card",
			"Card has already been blocked"
		);
	}
}

export async function ValidateToUnlockCard(
	isBlocked: boolean){
		
	if(isBlocked === false){
		throw new AppError(
			"Unlocked Card",
			409,
			"Unlocked Card",
			"Card has already been unlocked"
		);
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
		throw new AppError(
			"Company not found",
			404,
			"Company not found with API key",
			"Ensure to provide the correct API key"
		);
	}
	return result;
}

export async function ValidateEmployeeId(
	employeeId : number){

    const result = await employeesRepository.SeachEmployeeById(employeeId)
    if (!result) {
		throw new AppError(
			"Employee not found",
			404,
			"Employee not found with id",
			"Ensure to provide the correct employee id"
		);
	}
	return result;
}

export async function ValidateCompanyRegisteredEmployee(
	id: number, 
	companyId: number){
		
    if (id !== companyId){
        throw new AppError(
			"Unregistered employee",
			404,
			"Unregistered employee",
			"Inform a valid company employee"
		);
    }
}

export async function ValidateEmployeeHasTypeCard(
	employeeId: number, 
	typeCard: TransactionTypes){

    const result = await cardsRepository.SeachEmployeeCardByType(employeeId, typeCard)
    if (result) {
		throw new AppError(
			"Invalid Type Card",
			404,
			"Invalid Type Card",
			"Employee already has this type of card"
		);
	}	
}

export async function ValidateCardByNumber(
	number: string){	

	const cardData = await cardsRepository.SearchCardByNumber(number)
	
	if(!cardData){
		throw new AppError(
			"Card not found",
			404,
			"Card not found",
			"Ensure to provide the correct card informations"
		)
	}

	return cardData
}

export async function ValidateCardSecurityCode(
	securityCode: string,
	cardSecurityCode: string){

	const cryptr = new Cryptr("SecretKey");    
    const securityCodeDecrypt: string = cryptr.decrypt(cardSecurityCode)
	console.log(securityCodeDecrypt) //tirar

	if(securityCode !== securityCodeDecrypt){		
		throw new AppError(
			"Incorrect security code",
			404,
			"Incorrect security code",
			"Ensure to provide the correct card informations"
		);
	}
}

export async function ValidateCardHasPassword(
	password: string){

	if (password){
		throw new AppError(
			"Card already activated",
			404,
			"Card already activated",
			"Card has already been activated"
		);
	}
}

export async function ValidateCardHasNoPassword(
	password: string){

	if(!password){
		throw new AppError(
			"Incorrect password",
			404,
			"Incorrect password",
			"Ensure to provide the correct card informations"
		);
	}
}

export async function ValidateCardExpirationDate(
	expirationDate: string){

	if(dayjs(new Date()).isAfter(dayjs(expirationDate, "MM/YY"))){
		throw new AppError(
			"Card expired",
			409,
			"This card has expired",
			"Ensure to provide a valid card ID"
		);
	}
}

export async function ValidateCardById(
	cardId: number){
		
	const cardData = await cardsRepository.SearchCardById(cardId)

	if(!cardData){
		throw new AppError(
			"Card not found",
			404,
			"Card not found",
			"Ensure to provide the correct card informations"
		);
	}	
}

export async function ValidateCardPassword(
	informedPassword: string, 
	password: string ){

	const cryptr = new Cryptr("SecretKey");    
    const passwordDecrypt: string = cryptr.decrypt(password)
	console.log(passwordDecrypt) //tirar

	if(informedPassword !== passwordDecrypt){		
		throw new AppError(
			"Incorrect password",
			404,
			"Incorrect password",
			"Ensure to provide the correct card informations"
		)
	}
}

export async function ValidateBusinessByName(
	businessName: string){

	const businessData = await businessRepository.SearchBusinessByName(businessName)

	if(!businessData){
		throw new AppError(
			"Business not found",
			404,
			"Business not found",
			"Ensure to provide the correct business informations"
		)
	}

	return businessData
}

export async function ValidateTypeBusiness(
	typeBusiness: string,
	typeCard: string){

	if(typeCard !== typeBusiness){
		throw new AppError(
			"Incorrect type",
			404,
			"Incorrect type",
			"It is not possible to use the card in this place"
		);
	}
}

export async function ValidateAmountPayment(
	amount: number,
	cardId: number){

	const { balance } = await cardsRepository.GetBalance(cardId)

	if(amount > balance){
		throw new AppError(
			"Insufficient balance",
			404,
			"Insufficient balance",
			"Insufficient balance for this payment"
		);
	}
}