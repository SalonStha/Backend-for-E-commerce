const Joi = require('joi');

const CheckoutDTO = Joi.object({
    cartId: Joi.array().items(Joi.string()).required(),
    voucher: Joi.string().allow(null, "").default(null).optional(),
})

module.exports = {
    CheckoutDTO
}