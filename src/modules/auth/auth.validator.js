const Joi = require("joi");

const EmailDTO = Joi.string()
  .email({ tlds: { allow: ["com", "net", "np"] } })
  .required()
  .messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  });

const PasswordDTO = Joi.string().min(8).max(20).required().messages({
  "string.empty": "Password cannot be empty",
  "string.min": "Password must be at least 8 characters long",
  "string.max": "Password must be at most 20 characters long",
});
const RegisterDTO = Joi.object({
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name must be at most 30 characters long",
  }),
  lastName: Joi.string().min(5).max(30).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 5 characters long",
    "string.max": "Last name must be at most 30 characters long",
  }),
  email: EmailDTO,
  password: Joi.string()
    .min(8)
    .max(20)
    .required()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_|?])[A-Za-z\d!@#$%^&*_|?]{8,20}$/
    )
    .messages({
      "string.empty": "Password cannot be empty",
      "any.only": "Passwords do not match",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  confirmPassword: Joi.string().equal(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    "string.empty": "Confirm password cannot be empty",
  }),
  phoneNumber: Joi.string()
    .regex(
      /^(?:\+977[- ]?)?(?:98\d{8}|97\d{8}|96\d{8}|90\d{8}|0\d{7,10}|[2-9]\d{6})$/
    ) // Regex for Nepali phone numbers
    .allow("", null)
    .optional()
    .default(null)
    .messages({
      "string.pattern.base": "Phone number must be a valid Nepali phone number",
    }),
  address: Joi.object({
    billingAddress: Joi.string().max(100).allow(null, "").default(null),
    shippingAddress: Joi.string().max(100).allow(null, "").default(null),
  })
    .allow(null, "")
    .default(null)
    .messages({
      "object.base": "Address must be a valid object",
      "string.max": "Address must be at most 100 characters long",
    }),
  role: Joi.string()
    .allow("admin", "customer", "seller")
    .default("customer")
    .regex(/^(admin|customer|seller|Admin|Customer|Seller)$/i) // Allow case-insensitive matching
    .messages({
      "any.only": "Role must be either 'admin', 'customer', or 'seller'",
      "string.pattern.base":
        "Role must be either 'admin', 'customer', or 'seller'",
       "string.empty": "Role cannot be empty" 
    }),
  gender: Joi.string()
    .regex(/^(male|female|other|Male|Female|Other)$/)
    .optional()
    .default(null)
    .messages({
      "any.only": "Gender cannot be identified",
      "string.pattern.base": "Gender cannot be identified",
      "string.empty": "Gender cannot be empty",
    }),
  image: Joi.string().allow(null, "").optional().default(null),
  dob: Joi.string().allow(null, "").optional().default(null).messages({
    "string.empty": "Date of birth cannot be empty",
  }),
});

const LoginDTO = Joi.object({
  email: EmailDTO,
  password: PasswordDTO,
});

const ForgetPasswordDTO = Joi.object({
  email: EmailDTO,
});
const ResetPasswordDTO = Joi.object({
  password: Joi.string()
    .min(8)
    .max(20)
    .required()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_|?])[A-Za-z\d!@#$%^&*_|?]{8,20}$/
    )
    .messages({
      "string.empty": "Password cannot be empty",
      "any.only": "Passwords do not match",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  confirmPassword: Joi.string().equal(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password cannot be empty",
  }),
});

const UpdateUserDTO = Joi.object({
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name must be at most 30 characters long",
  }),
  lastName: Joi.string().min(5).max(30).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 5 characters long",
    "string.max": "Last name must be at most 30 characters long",
  }),
  phoneNumber: Joi.string()
    .regex(
      /^(?:\+977[- ]?)?(?:98\d{8}|97\d{8}|96\d{8}|90\d{8}|0\d{7,10}|[2-9]\d{6})$/
    ) // Regex for Nepali phone numbers
    .allow("", null)
    .optional()
    .default(null)
    .messages({
      "string.pattern.base": "Phone number must be a valid Nepali phone number",
    }),
  address: Joi.object({
    billingAddress: Joi.string().max(100).allow(null, "").default(null),
    shippingAddress: Joi.string().max(100).allow(null, "").default(null),
  })
    .allow(null, "")
    .default(null)
    .messages({
      "object.base": "Address must be a valid object",
      "string.max": "Address must be at most 100 characters long",
    }),
  role: Joi.string()
    .allow("admin", "customer", "seller")
    .default("customer")
    .regex(/^(admin|customer|seller|Admin|Customer|Seller)$/i) // Allow case-insensitive matching
    .messages({
      "any.only": "Role must be either 'admin', 'customer', or 'seller'",
      "string.pattern.base":
        "Role must be either 'admin', 'customer', or 'seller'",
    }),
  gender: Joi.string()
    .regex(/^(male|female|other|Male|Female|Other)$/)
    .optional()
    .default(null)
    .messages({
      "any.only": "Gender cannot be identified",
      "string.pattern.base": "Gender cannot be identified",
      "string.empty": "Gender cannot be empty",
    }),
  image: Joi.string().allow(null, "").optional().default(null),
  dob: Joi.string().allow(null, "").optional().default(null).messages({
    "string.empty": "Date of birth cannot be empty",
  }),
});

module.exports = {
  RegisterDTO,
  LoginDTO,
  EmailDTO,
  ForgetPasswordDTO,
  ResetPasswordDTO,
  UpdateUserDTO
};
