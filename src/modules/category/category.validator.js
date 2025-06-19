const { Status } = require("../../config/constants");
const Joi = require("joi");

const CategoryCreateDTO = Joi.object({
  name: Joi.string().required().min(2).max(50)
  .messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must be at most 50 characters long",
    "string.empty": "Name is required"
  }),
  parentId: Joi.string().allow(null, '').optional().default(null),
  brands: Joi.array().items(Joi.string().allow(null, '').optional().default(null)).allow(null, '').optional(). default(null),
  showInMenu : Joi.boolean().default(false),
  homeFeature : Joi.boolean().default(false),
  status: Joi.string().regex(/^(active|inactive|Active|Inactive)$/).default(Status.INACTIVE)
  .messages({
    "string.pattern.base": "Status must be active or inactive",
    "any.required": "Status is required",
    "string.empty": "Status must be active or inactive",
  }),
  icon: Joi.string().allow(null, '').default(null)
});

const CategoryUpdateDTO = Joi.object({
  name: Joi.string().required().min(2).max(50)
  .messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must be at most 50 characters long",
    "string.empty": "Name is required"
  }),
  parentId: Joi.string().allow(null, '').optional().default(null),
  brands: Joi.array().items(Joi.string().allow(null, '').optional().default(null)).allow(null, '').optional(). default(null),
  showInMenu : Joi.boolean().default(false),
  homeFeature : Joi.boolean().default(false),
  status: Joi.string().regex(/^(active|inactive|Active|Inactive)$/).default(Status.INACTIVE)
  .messages({
    "string.pattern.base": "Status must be active or inactive",
    "any.required": "Status is required",
    "string.empty": "Status must be active or inactive",
  }),
  icon: Joi.string().allow(null, '').default(null)
});


module.exports = {
  CategoryCreateDTO,
  CategoryUpdateDTO

};