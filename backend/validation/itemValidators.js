const Joi = require("joi");

const validator = (schema) => (payload) => {
    return schema.validate(payload, { abortEarly: false });
}

const addingItemSchema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string(),
    author: Joi.string(),
    isbn: Joi.string(),
    coverImage: Joi.string(),
    user: Joi.string().required(),

});

module.exports.addingItemValidator = validator(addingItemSchema);