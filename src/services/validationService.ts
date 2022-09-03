import * as cardsRepository from "../repositories/cardsRepository"
import * as employeesRepository from "../repositories/employeesRepository"
import * as companiesRepository from "../repositories/companiesRepository"
import { CardTypes } from "../types/cardTypes"
import AppError from "../config/error"

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

export async function ValidateEmployeeHasTypeCard(employeeId: number, typeCard: CardTypes){
    const result = await cardsRepository.SeachByType(employeeId, typeCard)
    if (result) {
		throw new AppError(
			"Invalid Type Card",
			404,
			"Invalid Type Card",
			"Employee already has this type of card"
		);
	}
	return result;
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