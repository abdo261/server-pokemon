const Joi = require("joi");

const ValidateCreatePaymentOffer = (paymentOffer) => {
  const schema = Joi.object({
    offersIds: Joi.array().items(Joi.number()).min(1).required().messages({
      "array.base": "Offers must be an array.",
      "array.min": "At least one offer ID is required.",
      "any.required": "Offer IDs are required.",
    }),
    totalePrice: Joi.number().required().greater(0).messages({
      "number.base": "Total price must be a number.",
      "number.greater": "Total price must be greater than zero.",
      "any.required": "Total price is required.",
    }),
    isPayed: Joi.boolean().optional(),
  });

  const { error, value } = schema.validate(paymentOffer, { abortEarly: false });

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

module.exports = { ValidateCreatePaymentOffer };
