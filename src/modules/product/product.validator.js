const { Status } = require("../../config/constants");
const Joi = require("joi");

const ProductCreateDTO = Joi.object({
  name: Joi.string().required().min(2).max(200)
  .messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must be at most 200 characters long",
    "string.empty": "Name is required"
  }),
  description: Joi.string().allow(null, '').required(),
  price: Joi.number().min(100).required(),
  discount: Joi.number().min(0).max(70).allow(null, '').optional(),
  category: Joi.array().items(Joi.string()).required(),
  tags: Joi.array().items(Joi.string()).optional().allow(null, ''),
  stock: Joi.number().min(0).default(0).allow(null, '').optional(),
  brand: Joi.string().allow(null, '').optional().default(null),
  attributes: Joi.array().items({
    key: Joi.string(),
    value: Joi.array().items(Joi.string())
  }).allow(null, '').optional().default(null),
  sku: Joi.string().allow(null, '').optional().default(null),
  homeFeature : Joi.boolean().default(false),
  status: Joi.string().regex(/^(active|inactive|Active|Inactive)$/).default(Status.INACTIVE)
  .messages({
    "string.pattern.base": "Status must be active or inactive",
    "any.required": "Status is required",
    "string.empty": "Status must be active or inactive",
  }),
  images: Joi.array().items(Joi.string()).allow(null, '').optional().default(null),
});

const ProductUpdateDTO = Joi.object({
  name: Joi.string().required().min(2).max(200)
  .messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must be at most 200 characters long",
    "string.empty": "Name is required"
  }),
  description: Joi.string().allow(null, '').required(),
  price: Joi.number().min(100).required(),
  discount: Joi.number().min(0).max(70).allow(null, '').optional(),
  category: Joi.array().items(Joi.string()).required(),
  tags: Joi.array().items(Joi.string()).optional().allow(null, ''),
  stock: Joi.number().min(0).default(0).allow(null, '').optional(),
  brand: Joi.string().allow(null, '').optional().default(null),
  attributes: Joi.array().items({
    key: Joi.string(),
    value: Joi.array().items(Joi.string())
  }).allow(null, '').optional().default(null),
  sku: Joi.string().allow(null, '').optional().default(null),
  homeFeature : Joi.boolean().default(false),
  status: Joi.string().regex(/^(active|inactive|Active|Inactive)$/).default(Status.INACTIVE)
  .messages({
    "string.pattern.base": "Status must be active or inactive",
    "any.required": "Status is required",
    "string.empty": "Status must be active or inactive",
  }),
  images: Joi.array().items(Joi.string()).allow(null, '').optional().default(null),
});


module.exports = {
  ProductCreateDTO,
  ProductUpdateDTO

};