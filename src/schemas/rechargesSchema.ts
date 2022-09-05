import joi from "joi"

const numberRegex = /^\d{4} \d{4} \d{4} \d{4}$/

const RechargeSchema = joi.object({
	number: joi.string().pattern(numberRegex).required(),
    amount: joi.number().integer().min(1).required()
});

export default RechargeSchema