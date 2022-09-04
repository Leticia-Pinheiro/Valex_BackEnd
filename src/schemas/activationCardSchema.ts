import joi from "joi"

const passwordRegex = /^\d{4}$/
const numberRegex = /^\d{4} \d{4} \d{4} \d{4}$/

const ActivationCardSchema = joi.object({
	number: joi.string().pattern(numberRegex).required(),	
	securityCode: joi.string().length(3).required(),
	password: joi.string().length(4).pattern(passwordRegex).required(),
});

export default ActivationCardSchema;