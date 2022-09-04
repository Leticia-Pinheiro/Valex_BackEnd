import joi from "joi"

const TransactionSchema = joi.object({
	cardId: joi.number().positive().integer().strict().required()
});

export default TransactionSchema