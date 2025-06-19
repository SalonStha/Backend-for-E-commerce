const { Status } = require("../../config/constants");
const Joi = require("joi");

const BannerCreateDTO = Joi.object({
  title: Joi.string().required().min(2).max(50),
  link: Joi.string().allow(null, '').default(null),
  status: Joi.string().regex(/^(active|inactive|Active|Inactive)$/).default(Status.INACTIVE).
  messages({
    "string.pattern.base": "Status must be active or inactive",
    "any.required": "Status is required",
  }),
  image: Joi.string().allow(null, '').default(null)
});

const BannerUpdateDTO = Joi.object({
  title: Joi.string().required().min(2).max(50),
  link: Joi.string().allow(null, '').default(null),
  status: Joi.string().regex(/^(active|inactive|Active|Inactive)$/).default(Status.INACTIVE).
  messages({
    "string.pattern.base": "Status must be active or inactive",
    "any.required": "Status is required",
  }),
  image: Joi.string().allow(null, '').default(null)
});


module.exports = {
  BannerCreateDTO,
  BannerUpdateDTO

};