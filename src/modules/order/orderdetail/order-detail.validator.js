const Joi = require('joi');

const AddToCartDTO = Joi.object({
        productId: Joi.string().required().messages({
        'string.empty': 'Product ID is required',
        'any.required': 'Product ID is required',
        }),
        quantity: Joi.number().integer().min(1).max(10).required().messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required',
        }),
});

const DeleteFromCartDTO = Joi.object({
    productId: Joi.string().required().messages({
        'string.empty': 'Product ID is required',
        'any.required': 'Product ID is required',
        }),
        quantity: Joi.number().integer().min(0).max(10).required().messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required',
        }),
});

module.exports = {
    AddToCartDTO,
    DeleteFromCartDTO,
}