const Joi = require("joi");

const ValidateCreatePayment = (payment) => {
  const schema = Joi.object({
    details: Joi.object().required().messages({
      "object.base": "Payment details are required.",
    }),
    totalPrice: Joi.number().required().greater(0).messages({
      "number.base": "Total price must be a number.",
      "number.greater": "Total price must be greater than zero.",
    }),
    isPayed: Joi.boolean().optional(),
    isLocal: Joi.boolean().optional(),
    type: Joi.string().valid("NORMAL", "OFFRE").default("NORMAL"),
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

module.exports = { ValidateCreatePayment };
