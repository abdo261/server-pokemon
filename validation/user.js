const Joi = require("joi");

const ValidateCreateUser = (user) => {
  const schema = Joi.object({
    userName: Joi.string()
      .trim()
      .min(3)
      .required()
      .regex(/^[a-zA-ZÀ-ÿ][a-z0-9A-ZÀ-ÿ\s'_’-]*$/)
      .messages({
        "string.empty": "Le nom d'utilisateur est requis.",
        "string.min": "Le nom d'utilisateur doit comporter au moins 3 caractères.",
        "string.pattern.base":
          "Le nom d'utilisateur doit commencer par une lettre et ne peut contenir que des lettres, des accents, des espaces, des apostrophes, des tirets, et des underscores.",
      }),
    email: Joi.string().trim().email().required().messages({
      "string.email": "L'email doit être valide.",
      "string.empty": "L'email est requis.",
    }),
    password: Joi.string().trim().min(6).required().messages({
      "string.min": "Le mot de passe doit comporter au moins 6 caractères.",
      "string.empty": "Le mot de passe est requis.",
    }),
    image: Joi.string().uri().optional().allow(null).messages({
      "string.uri": "L'URL de l'image doit être valide (commençant par http ou https).",
    }),
    role: Joi.string().valid('ADMIN', 'RESPONSABLE', 'LIVREUR').optional(),
  });

  const { error, value } = schema.validate(user, { abortEarly: false });

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
const ValidateUpdateUser = (user) => {
  const schema = Joi.object({
    userName: Joi.string()
      .trim()
      .min(3)
      .required()
      .regex(/^[a-zA-ZÀ-ÿ][a-z0-9A-ZÀ-ÿ\s'_’-]*$/)
      .messages({
        "string.empty": "Le nom d'utilisateur est requis.",
        "string.min": "Le nom d'utilisateur doit comporter au moins 3 caractères.",
        "string.pattern.base":
          "Le nom d'utilisateur doit commencer par une lettre et ne peut contenir que des lettres, des accents, des espaces, des apostrophes, des tirets, et des underscores.",
      }),
    email: Joi.string().trim().email().required().messages({
      "string.email": "L'email doit être valide.",
      "string.empty": "L'email est requis.",
    }),
    password: Joi.string().optional().trim().min(6).messages({
      "string.min": "Le mot de passe doit comporter au moins 6 caractères.",
    }),
    image: Joi.string().uri().optional().allow(null).messages({
      "string.uri": "L'URL de l'image doit être valide (commençant par http ou https).",
    }),
    role: Joi.string().valid('ADMIN', 'RESPONSABLE', 'LIVREUR').optional(),
  });

  const { error, value } = schema.validate(user, { abortEarly: false });

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

module.exports = { ValidateCreateUser,ValidateUpdateUser };
