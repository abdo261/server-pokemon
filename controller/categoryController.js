const prisma = require("../utils/db");
const { ValidateCreateCategory } = require("../validation/catagory");
const { deleteImage, renameImage } = require("./imageController");
const fs = require("fs");
const path = require("path");
// Get All Categories
async function getAllCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération des catégories:  " + error.message,
    });
  }
}
async function getAllCategoriesWithProduct(req, res) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération des catégories:  " + error.message,
    });
  }
}

// Get Category by ID
async function getCategoryById(req, res) {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          select: {
            name: true,
            imageFile: true,
            isPublish: true,
            price: true,
            type: true,
            createdAt: true,
            id: true,
            _count: {
              select: {
                payments: true,
              },
            },
          },
        },
      },
    });
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération de la catégorie: " + error.message,
    });
  }
}

async function createCategory(req, res) {
  const { name, color } = req.body;

  // Validate
  const { error } = ValidateCreateCategory({ name, color });
  if (error) {
    return res.status(400).json(error);
  }

  try {
    // Check for existing categories
    const existingCategoryByColor = await prisma.category.findUnique({
      where: { color },
    });
    if (existingCategoryByColor) {
      return res
        .status(400)
        .json({ color: ["Une catégorie avec cette couleur existe déjà"] });
    }

    const existingCategoryByName = await prisma.category.findUnique({
      where: { name },
    });
    if (existingCategoryByName) {
      return res
        .status(400)
        .json({ name: ["Une catégorie avec ce nom existe déjà"] });
    }
    let imagePath = null;
    if (req.file) {
      imagePath = `/images/category/${req.file.filename}`; // Set image path using the uploaded file's filename
    }
    const category = await prisma.category.create({
      data: {
        name,
        color,
        imageFile: imagePath,
      },
    });

    res.status(201).json({
      message: `Catégorie ${category.name} créée avec succès`,
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la catégorie: " + error.message,
    });
  }
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, color, imageFile } = req.body; // imageFile can be 'null'
  const image = req.file;

  const { error } = ValidateCreateCategory({ name, color });
  if (error) {
    return res.status(400).json(error);
  }

  try {
    // Find the existing category by ID
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    // Check for unique name and color
    if (name && name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({ where: { name } });
      if (nameExists) {
        return res
          .status(400)
          .json({ name: ["Un autre catégorie avec ce nom existe déjà"] });
      }
    }

    if (color && color !== existingCategory.color) {
      const colorExists = await prisma.category.findUnique({
        where: { color },
      });
      if (colorExists) {
        return res.status(400).json({ color: ["Cette couleur existe déjà"] });
      }
    }

    let imagePath = existingCategory.imageFile;

    // If a new image file is uploaded
    if (image) {
      // Create new image path
      imagePath = `/images/category/${name}${path.extname(image.originalname)}`;

      // Delete old image if it exists
      if (existingCategory.imageFile) {
        await deleteImage(existingCategory.imageFile);
      }

      // Move the uploaded file to the new path
      await fs.promises.rename(
        image.path,
        path.join(__dirname, "..", imagePath)
      );
    } else if (imageFile === "null" && existingCategory.imageFile) {
      // Remove the existing image if specified
      await deleteImage(existingCategory.imageFile);
      imagePath = null; // No image associated with the category
    }

    // Rename the image if the name has changed and an image exists
    if (name && name !== existingCategory.name && existingCategory.imageFile) {
      const oldImagePath = existingCategory.imageFile;
      const newImagePath = `/images/category/${name}${path.extname(
        oldImagePath
      )}`;
      await fs.promises.rename(
        path.join(__dirname, "..", oldImagePath),
        path.join(__dirname, "..", newImagePath)
      );
      imagePath = newImagePath; // Update to new image path
    }
    // Update the category with the new data
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        color,
        imageFile: imagePath,
      },
    });

    res.status(200).json({
      message: "Catégorie mise à jour avec succès",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la mise à jour de la catégorie: " + error.message,
    });
  }
}

// Delete a Category by ID
async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    if (existingCategory.imageFile) {
      await deleteImage(existingCategory.imageFile);
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la suppression de la catégorie: " + error.message,
    });
  }
}
async function createManyCategories(req, res) {
  const categories = req.body;

  try {
    const upsertPromises = categories.map((category) =>
      prisma.category.upsert({
        where: { id: category.id },
        update: {
          name: category.name,
          color: category.color,
          image: category.image,
          updatedAt: new Date(category.updatedAt).toISOString(),
        },
        create: {
          id: category.id,
          name: category.name,
          color: category.color,
          image: category.image,
          createdAt: new Date(category.createdAt).toISOString(),
          updatedAt: new Date(category.updatedAt).toISOString(),
        },
      })
    );

    const results = await Promise.all(upsertPromises);

    res.status(200).json({
      message: `${results.length} catégories traitées avec succès`,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la création ou mise à jour des catégories: " +
        error.message,
    });
  }
}
const getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true, // Just to count the products
          },
        },
      },
    });

    const categoriesWithCount = categories.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      productCount: category.products.length, // Count of products
    }));

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des catégories.",
    });
  }
};
module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createManyCategories,
  getCategoriesWithCount,
  getAllCategoriesWithProduct,
};
