const Joi = require("joi");

const ValidateCreateCategory = (category) => {
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
    color: Joi.string()
      .trim()
      .required()
      .regex(
        /^#([0-9A-Fa-f]{3}){1,2}$|^rgba?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*(,\s*(0|1|0?\.\d+))?\)$/
      )
      .messages({
        "string.empty": "La couleur est requise.",
        "string.pattern.base":
          "La couleur doit être un code hexadécimal valide (ex : #FFF ou #FFFFFF) ou une valeur rgba (ex : rgba(255, 255, 255, 1)).",
      }),
    image: Joi.any()
      .optional()
      .custom((value, helpers) => {
        if (!value) return value;
        if (value instanceof File) {
          const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
          if (!validImageTypes.includes(value.type)) {
            return helpers.message(
              "Le fichier doit être une image valide (JPEG, PNG, GIF)."
            );
          }
          return value;
        }
      })
      .messages({
        "any.base": "Le fichier image doit être une valeur valide.",
      }),

    createdAt: Joi.date().iso().optional().messages({
      "date.base": "La date de création doit être valide.",
    }),
    updatedAt: Joi.date().iso().optional().messages({
      "date.base": "La date de mise à jour doit être valide.",
    }),
  });

  const { error, value } = schema.validate(category, { abortEarly: false });

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

module.exports = { ValidateCreateCategory };
