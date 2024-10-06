const Joi = require("joi");

const ValidateCreateProduct = (product) => {
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
    categoryId: Joi.alternatives()
      .try(Joi.number().integer(), Joi.string().guid({ version: ["uuidv4"] }))
      .optional()
      .messages({
        "string.guid": "La catégorie doit être un identifiant UUID valide.",
        "number.base":
          "La catégorie doit être un identifiant numérique valide.",
      }),
    price: Joi.number().positive().precision(2).required().messages({
      "number.base": "Le prix doit être un nombre.",
      "number.positive": "Le prix doit être un nombre positif.",
      "any.required": "Le prix est requis.",
    }),
    type: Joi.string().allow(null)
      .valid("CHARBON", "PANINI", "FOUR")
      .optional()
      .messages({
        "any.only":
          "Le type doit être l'un des types suivants : Charbon, Panini, Four.",
      }),
    isPublish: Joi.boolean(),
    image: Joi.string().trim().uri().allow(null).optional().messages({
      "string.uri":
        "L'URL de l'image doit être valide (commençant par http ou https).",
    }),
    createdAt: Joi.date().iso().optional().messages({
      "date.base": "La date de création doit être valide.",
    }),
    updatedAt: Joi.date().iso().optional().messages({
      "date.base": "La date de mise à jour doit être valide.",
    }),
  });

  const { error, value } = schema.validate(product, { abortEarly: false });

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

module.exports = { ValidateCreateProduct };
