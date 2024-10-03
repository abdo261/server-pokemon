const Joi = require("joi");

const ValidateCreateOffer = (offer) => {
  const schema = Joi.object({
    price: Joi.number()
      .positive()
      .required()
      .messages({
        'number.base': 'Le prix doit être un nombre.',
        'number.positive': 'Le prix doit être un nombre positif.',
        'any.required': 'Le prix est requis.'
      }),
    products: Joi.array()
      .messages({
        'array.base': 'Les produits doivent être un tableau.',
      }),
    image: Joi.any().optional(),
  });

  const { error, value } = schema.validate(offer, { abortEarly: false });

  return {
    error: error ? error.details.reduce((acc, err) => {
      const field = err.context.key;
      const message = err.message;
      if (!acc[field]) acc[field] = [];
      acc[field].push(message);
      return acc;
    }, {}) : null,
    data: value,
  };
};

module.exports = { ValidateCreateOffer };
