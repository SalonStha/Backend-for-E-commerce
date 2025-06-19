const { Status } = require("../../config/constants");
const Joi = require("joi");

const BrandCreateDTO = Joi.object({
  name: Joi.string().required().min(2).max(50),
  status: Joi.string().regex(/^(active|inactive|Active|Inactive)$/).default(Status.INACTIVE).
  messages({
    "string.pattern.base": "Status must be active or inactive",
    "any.required": "Status is required",
  }),
  logo: Joi.string().allow(null, '').default(null)
});

const BrandUpdateDTO = Joi.object({
  name: Joi.string().required().min(2).max(50)
  .messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must be at most 50 characters long",
    "string.empty": "Name is required"
  }),
  status: Joi.string().regex(/^(active|inactive|Active|Inactive)$/).default(Status.INACTIVE)
  .messages({
    "string.pattern.base": "Status must be active or inactive",
    "any.required": "Status is required",
    "string.empty": "Status must be active or inactive",
  }),
  logo: Joi.string().allow(null, '').default(null)
});


module.exports = {
  BrandCreateDTO,
  BrandUpdateDTO

};