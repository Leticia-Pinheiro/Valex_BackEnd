import joi from "joi"

const passwordRegex = /^\d{4}$/
const numberRegex = /^\d{4} \d{4} \d{4} \d{4}$/

const BlockAndUnlockSchema = joi.object({
	number: joi.string().pattern(numberRegex).required(),
	password: joi.string().length(4).pattern(passwordRegex).required()
});

export default BlockAndUnlockSchema