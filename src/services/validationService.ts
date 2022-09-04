import * as cardsRepository from "../repositories/cardsRepository"
import * as employeesRepository from "../repositories/employeesRepository"
import * as companiesRepository from "../repositories/companiesRepository"
import { TransactionTypes } from "../utils/types"
import AppError from "../utils/error"
import Cryptr from "cryptr"

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);


export async function ValidateApiKey(companyApiKey : string){
    const result = await companiesRepository.SeachByApiKey(companyApiKey)
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

export async function ValidateEmployeeId(employeeId : number){
    const result = await employeesRepository.SeachById(employeeId)
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

export async function ValidateEmployeeHasTypeCard(employeeId: number, typeCard: TransactionTypes){
    const result = await cardsRepository.SeachByType(employeeId, typeCard)
    if (result) {
		throw new AppError(
			"Invalid Type Card",
			404,
			"Invalid Type Card",
			"Employee already has this type of card"
		);
	}	
}

export async function ValidateRegisteredEmployee(id: number, companyId: number){
    if (id !== companyId){
        throw new AppError(
			"Unregistered employee",
			404,
			"Unregistered employee",
			"Inform a valid company employee"
		);
    }
}

export async function ValidateCardByNumber(
	number: string,
	securityCode: string){
		console.log(securityCode)

	const cardData = await cardsRepository.ValidateCardByNumber(number)
	
	const cryptr = new Cryptr("SecretKey");    
    const securityCodeDecrypt: string = cryptr.decrypt(cardData.securityCode)
	console.log(securityCodeDecrypt)

	if(securityCode !== securityCodeDecrypt){		
		throw new AppError(
			"Incorrect security code",
			404,
			"Incorrect security code",
			"Ensure to provide the correct card informations"
		);
	}

	if(!cardData){
		throw new AppError(
			"Card not found",
			404,
			"Card not found",
			"Ensure to provide the correct card informations"
		);
	}

	
	if (cardData.password){
		throw new AppError(
			"Card already activated",
			404,
			"Card already activated",
			"Card has already been activated"
		);
	}

	if(dayjs(new Date()).isAfter(dayjs(cardData.expirationDate, "MM/YY"))){
		throw new AppError(
			"Card expired",
			409,
			"This card has expired",
			"Ensure to provide a valid card ID"
		);
	}
	
}

export async function ValidateCardById(cardId: number){
	const cardData = await cardsRepository.ValidateCardById(cardId)

	if(!cardData){
		throw new AppError(
			"Card not found",
			404,
			"Card not found",
			"Ensure to provide the correct card informations"
		);
	}

	
}