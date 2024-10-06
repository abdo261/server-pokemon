const prisma = require("../utils/db");
const {
  ValidateCreateUser,
  ValidateUpdateUser,
} = require("../validation/user");

// Get All Users
async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        email: true,
        imageFile: true,
        role: true,
        phone: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération des utilisateurs: " + error.message,
    });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        userName: true,
        email: true,
        imageFile: true,
        role: true,
        phone: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération de l'utilisateur: " + error.message,
    });
  }
}

// Create a New User
async function createUser(req, res) {
  const { userName, email, password, imageFile, role, image, phone } = req.body;
  const { error } = ValidateCreateUser({
    userName,
    email,
    password,
    image,
    role,
    phone,
  });
  if (error) {
    return res.status(400).json(error);
  }
  try {
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return res.status(400).json({ email: ["Cet email est déjà utilisé"] });
    }

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password,
        imageFile,
        role,
        phone,
      },
    });
    res.status(201).json({
      message: `Utilisateur ${user.userName} créé avec succès`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur: " + error.message,
    });
  }
}

// Update a User by ID
async function updateUser(req, res) {
  const { id } = req.params;
  const { userName, email, password, imageFile, role, phone } = req.body;
  const { error } = ValidateUpdateUser({
    userName,
    email,
    password: password ? password : undefined,
    role,
    phone,
  });
  if (error) {
    return res.status(400).json(error);
  }
  try {
    // Find the existing user by ID
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Check if the new email is unique, excluding the current user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        return res.status(400).json({ email: ["Cet email est déjà utilisé"] });
      }
    }

    // Update the user with new data
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        userName,
        email,
        password,
        imageFile,
        role,
        phone,
      },
    });

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la mise à jour de l'utilisateur: " + error.message,
    });
  }
}

// Delete a User by ID
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la suppression de l'utilisateur: " + error.message,
    });
  }
}

// Create Many Users (Bulk Operation)
async function createManyUsers(req, res) {
  const users = req.body;

  try {
    const upsertPromises = users.map((user) =>
      prisma.user.upsert({
        where: { id: user.id },
        update: {
          userName: user.userName,
          email: user.email,
          password: user.password,
          imageFile: user.imageFile,
          role: user.role,
        },
        create: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          password: user.password,
          imageFile: user.imageFile,
          role: user.role,
        },
      })
    );

    const results = await Promise.all(upsertPromises);

    res.status(200).json({
      message: `${results.length} utilisateurs traités avec succès`,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la création ou mise à jour des utilisateurs: " +
        error.message,
    });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createManyUsers,
};
