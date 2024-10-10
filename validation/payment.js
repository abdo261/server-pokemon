const Joi = require("joi");

const ValidateCreatePayment = (payment,helper) => {
  const schema = Joi.object({
    totalePrice: Joi.number().required().greater(0).messages({
      "number.base": "Total price must be a number.",
      "number.greater": "Total price must be greater than zero.",
    }),
    isPayed: Joi.boolean().optional(),
    isLocal: Joi.boolean().optional(),
    productsIds: Joi.array().items(Joi.number()).min(1).required().messages({
      "array.base": "Products must be an array.",
      "array.min": "At least one product ID is required.",
      "any.required": "Product IDs are required.",
    }),
    delevryId: helper.isDelevry
    ? Joi.number()
        .required()
        .messages({
          "number.base": "Delivery ID must be a number.",
          "any.required": "Delivery ID is required when delivery is enabled.",
        })
    : Joi.allow(null).optional(),
    clientPhoneNumber: Joi.string()
      .trim()
      .allow(null)
      .optional()
      .pattern(/^(0|\+212)[\d]{9}$/)
      .messages({
        "string.pattern.base":
          "Le numéro de téléphone doit commencer par 0 ou +212 et contenir 9 chiffres supplémentaires.",
      }),
  });

  const { error, value } = schema.validate(payment, { abortEarly: false });

  return {
    error: error
      ? error.details.reduce((acc, err) => {
          const field = err.context.key;
          const message = err.message;
          if (!acc[field]) {
            acc[field] = [];
          }
          acc[field].push(message);
          return acc;
        }, {})
      : null,
    data: value,
  };
};

const ValidateUpdatePayment = (payment) => {
  const schema = Joi.object({
    totalePrice: Joi.number().required().greater(0).optional().messages({
      "number.base": "Total price must be a number.",
      "number.greater": "Total price must be greater than zero.",
    }),
    isPayed: Joi.boolean().optional(),
    productsIds: Joi.array().items(Joi.number()).optional().required().messages({
      "array.base": "Products must be an array.",
      "array.min": "At least one product ID is required.",
      "any.required": "Product IDs are required.",
    }),
    delevryId: Joi.allow(null).optional(),
    clientPhoneNumber: Joi.string()
      .trim()
      .allow(null)
      .optional()
      .pattern(/^(0|\+212)[\d]{9}$/)
      .messages({
        "string.pattern.base":
          "Le numéro de téléphone doit commencer par 0 ou +212 et contenir 9 chiffres supplémentaires.",
      }),
  });

  const { error, value } = schema.validate(payment, { abortEarly: false });

  return {
    error: error
      ? error.details.reduce((acc, err) => {
          const field = err.context.key;
          const message = err.message;
          if (!acc[field]) {
            acc[field] = [];
          }
          acc[field].push(message);
          return acc;
        }, {})
      : null,
    data: value,
  };
};

module.exports = { ValidateCreatePayment ,ValidateUpdatePayment};
