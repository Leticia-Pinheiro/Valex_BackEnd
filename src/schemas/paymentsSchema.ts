import joi from "joi"

const passwordRegex = /^\d{4}$/
const numberRegex = /^\d{4} \d{4} \d{4} \d{4}$/

const PaymentSchema = joi.object({
	number: joi.string().pattern(numberRegex).required(),
	password: joi.string().length(4).pattern(passwordRegex).required(),
    businessName: joi.string().required(),
    amount: joi.number().integer().min(1).required()
});

export default PaymentSchema