import joi from "joi"

const CardSchema = joi.object({
	employeeId: joi.number().positive().integer().strict().required(),
	typeCard: joi
		.string()
		.valid("groceries", "restaurant", "transport", "education", "health")
		.required(),
});

export default CardSchema