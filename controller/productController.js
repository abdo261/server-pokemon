const prisma = require("../utils/db");

async function getAllProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      include: {
        Category: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des produits: " + error.message,
    });
  }
}

// Get Product by ID
async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        Category: true,
        payments: true,
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du produit: " + error.message,
    });
  }
}

// Create a New Product
async function createProduct(req, res) {
  const { name, price, categoryId, image } = req.body;

  try {
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return res
          .status(400)
          .json({ categoryId: ["La catégorie spécifiée n'existe pas"] });
      }
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId: categoryId || undefined,
        image,
      },
    });

    res.status(201).json({
      message: `Produit ${product.name} créé avec succès`,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du produit: " + error.message,
    });
  }
}

// Update a Product by ID
async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, price, categoryId, image } = req.body;

  try {
    // Find the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Check if the new category exists
    if (categoryId && categoryId !== existingProduct.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return res
          .status(400)
          .json({ categoryId: ["La catégorie spécifiée n'existe pas"] });
      }
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price,
        categoryId,
        image,
      },
    });

    res.status(200).json({
      message: "Produit mis à jour avec succès",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du produit: " + error.message,
    });
  }
}

// Delete a Product by ID
async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    // Find the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du produit: " + error.message,
    });
  }
}

// Create Many Products
async function createManyProducts(req, res) {
  const products = req.body;

  try {
    const upsertPromises = products.map((product) =>
      prisma.product.upsert({
        where: { id: product.id },
        update: {
          name: product.name,
          price: product.price,
          categoryId: product.categoryId,
          image: product.image,
          updatedAt: product.updatedAt
            ? new Date(product.updatedAt).toISOString()
            : undefined,
        },
        create: {
          id: product.id, // Specify id if needed
          name: product.name,
          price: product.price,
          categoryId: product.categoryId,
          image: product.image,
          createdAt: product.createdAt
            ? new Date(product.createdAt).toISOString()
            : undefined,
          updatedAt: product.updatedAt
            ? new Date(product.updatedAt).toISOString()
            : undefined,
        },
      })
    );

    const results = await Promise.all(upsertPromises);

    res.status(200).json({
      message: `${results.length} produits traités avec succès`,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la création ou mise à jour des produits: " +
        error.message,
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createManyProducts,
};
