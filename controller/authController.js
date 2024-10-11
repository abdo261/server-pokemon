const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/db");
const { validateEmailAndPassword } = require("../validation/auth");
const SUCRET_KEY = process.env.SUCRET_KEY || "sucretky";

function sanitizeUser(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const { error } = validateEmailAndPassword({ email, password });
  if (error) {
    return res.status(400).json(error);
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        email: ["Identifiants incorrects"],
        password: ["Identifiants incorrects"],
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        email: ["Identifiants incorrects"],
        password: ["Identifiants incorrects"],
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SUCRET_KEY
      // ,
      // {
      //   expiresIn: "1h",
      // }
    );

    const sanitizedUser = sanitizeUser(user);
    
    return res.status(200).json({
      message: "Connexion réussie",
      token,
      user: sanitizedUser ,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la connexion de l'utilisateur: " + error.message,
    });
  }
}

module.exports = {
  loginUser,
};
