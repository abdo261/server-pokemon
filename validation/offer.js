const Joi = require("joi");

const ValidateCreateOffer = (offer) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .required()
      .regex(/^[a-zA-ZÀ-ÿ][a-z0-9A-ZÀ-ÿ\s'_’-]*$/)
      .messages({
        "string.empty": "Le nom est requis.",
        "string.min": "Le nom doit comporter au moins 3 caractères.",
        "string.pattern.base":
          "Le nom doit commencer par une lettre et ne peut contenir que des lettres, des accents, des espaces, des apostrophes, des tirets, et des underscores.",
      }),
    price: Joi.number().positive().required().messages({
      "number.base": "Le prix doit être un nombre.",
      "number.positive": "Le prix doit être un nombre positif.",
      "any.required": "Le prix est requis.",
    }),
    products: Joi.array().required().min(2).messages({
      "array.base": "Les produits doivent être un tableau.",
      "array.min": "Vous devez fournir au moins 2 produits.",
    }),
    isPublish: Joi.boolean(),
    image: Joi.any().optional(),
  });

  const { error, value } = schema.validate(offer, { abortEarly: false });

  return {
    error: error
      ? error.details.reduce((acc, err) => {
          const field = err.context.key;
          const message = err.message;
          if (!acc[field]) acc[field] = [];
          acc[field].push(message);
          return acc;
        }, {})
      : null,
    data: value,
  };
};

module.exports = { ValidateCreateOffer };
