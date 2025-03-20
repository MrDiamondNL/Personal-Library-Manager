const Joi = require("joi");

const schemas = {
    addingItem: Joi.object({
        title: Joi.string().required(),
        category: Joi.string().required(),
        description: Joi.string(),
        author: Joi.string(),
        isbn: Joi.string(),
        coverImage: Joi.string(),
        user: Joi.string().required(),
    }),

    lendItem: Joi.object({
        email: Joi.string().max(50).required(),
        id: Joi.string().required(),
    }),

    findItem: Joi.object({
        id: Joi.string().required(),
    })
}

const validateRequest = (schema) => {
    return (req, res, next) => {
        const {error, value} = schema.validate(req.body); 
        if (error) {
            console.log(error);
            return res.send(error.details);
        }
        next();
    }
    
}

module.exports = {
    addingItemValidator: validateRequest(schemas.addingItem),
    lendItemValidator: validateRequest(schemas.lendItem),
    findItemValidator: validateRequest(schemas.findItem),
};
