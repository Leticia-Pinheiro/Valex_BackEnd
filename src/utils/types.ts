export type TransactionTypes =
	| "groceries"
	| "restaurant"
	| "transport"
	| "education"
	| "health"

export interface Card{    
	employeeId: number
	number: string
	cardholderName: string
	securityCode: string
	cardExpirationDate: string
	password?: string
	isVirtual: boolean
	originalCardId?: number
	isBlocked: boolean
	type: TransactionTypes
}