const Joi = require("joi");
const { schema } = require("../models/Item");
const CustomError = require("../utils/customError")

const schemas = {
    addingItem: Joi.object({
        title: Joi.string().required().min(1),
        category: Joi.string(),
        description: Joi.string().allow(''),
        author: Joi.string().allow(''),
        isbn: Joi.string().allow(''),
        coverImage: Joi.string().allow(''),
        user: Joi.string().required(),
    }),

    lendItem: Joi.object({
        email: Joi.string().max(100).required(),
        id: Joi.string().required(),
    }),

    findItem: Joi.object({
        id: Joi.string().required(),

    }),

    addComment: Joi.object({
        id: Joi.string().required(),
        comment: Joi.string().min(1).max(200).required()
    })
}

const validateRequestBody = (schema) => {
    return (req, res, next) => {
        const {error, value} = schema.validate(req.body); 
        if (error) {
            console.log(error);
            return next(CustomError.badRequest("Validation error", error.details));
        }
        next();
    }    
}

const validateRequestParams = (schema) => {
    return (req, res, next) => {
        const {error, value} = schema.validate(req.params); 
        if (error) {
            console.log(error);
            return next(CustomError.badRequest("Validation error", error.details));
        }
        next();
    }    
}

module.exports = {
    addingItemValidator: validateRequestBody(schemas.addingItem),
    lendItemValidator: validateRequestBody(schemas.lendItem),
    findItemParamsValidator: validateRequestParams(schemas.findItem),
    addCommentValidator: validateRequestBody(schemas.addComment),
    findItemBodyValidator: validateRequestBody(schemas.findItem)
};
