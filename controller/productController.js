const prisma = require("../utils/db");
const { ValidateCreateProduct } = require("../validation/product");
const { deleteImage, renameImage } = require("./imageController");
const path = require('path')
const fs = require('fs')
async function getAllProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        _count: {
          select: {
            payments: true,
          },
        },
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
        category: true,
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
  const { name, price, categoryId, image, isPublish } = req.body;
  console.log(req.body);
  const { error } = ValidateCreateProduct({
    name,
    price,
    categoryId,
    image,
    isPublish,
  });
  if (error) {
    return res.status(400).json(error);
  }
  try {
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });

      if (!categoryExists) {
        return res
          .status(400)
          .json({ categoryId: ["La catégorie spécifiée n'existe pas"] });
      }
    }
    let imagePath = null;
    if (req.file) {
      imagePath = `/images/product/${req.file.filename}`; 
      console.log("File uploaded successfully:", imagePath); // Log success
    } else {
      console.log("No file uploaded."); // Log no file case
    }
    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        categoryId: parseInt(categoryId) || undefined,
        imageFile:imagePath,
        isPublish:isPublish==='true',
      },
      include: {
        category: true,
        _count: {
          select: {
            payments: true,
          },
        },
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
  const { name, price, categoryId, image, isPublish,imageFile } = req.body;
  const newIsPublish = isPublish ==="true"
  const { error } = ValidateCreateProduct({
    name,
    price,
    categoryId,
    image,
    isPublish:newIsPublish,
  });

  if (error) {
    return res.status(400).json(error);
  }
  try {
    // Find the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Check if the new category exists
    if (categoryId && parseInt(categoryId) !== existingProduct.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });
      if (!categoryExists) {
        return res
          .status(400)
          .json({ categoryId: ["La catégorie spécifiée n'existe pas"] });
      }
    }
    let imagePath = existingProduct.imageFile;

    if (req.file) {
      if (existingProduct.imageFile) {
        await deleteImage(existingProduct.imageFile);
      }
      imagePath = `/images/product/${name}${path.extname(req.file.originalname)}`;
      await fs.promises.rename(req.file.path, path.join(__dirname, '..', imagePath));
    } else if (name && name !== existingProduct.name && existingProduct.imageFile) {
      const oldImagePath = existingProduct.imageFile;
      const newImagePath = `/images/product/${name}${path.extname(oldImagePath)}`;
      if (oldImagePath !== newImagePath) {
        await renameImage(oldImagePath,  newImagePath);
        imagePath = newImagePath; // Update to the new image path
      }
    } else if (req.body.imageFile === "null" && existingProduct.imageFile) {
      await deleteImage(existingProduct.imageFile);
      imagePath = null; // No image associated with the product
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        categoryId:parseInt(categoryId),
        imageFile:imagePath,
        isPublish:newIsPublish,
      },
      include: {
        category: true,
        _count: {
          select: {
            payments: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Produit mis à jour avec succès",
      product,
    });
  } catch (error) {
    console.log(error)
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
    if (existingProduct.imageFile) {
      await deleteImage(existingProduct.imageFile);
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
          isPublish: product.isPublish,
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
          isPublish: product.isPublish,
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
