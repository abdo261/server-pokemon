const prisma = require("../utils/db") 

// Get All Categories
async function getAllCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des catégories:  ' + error.message
    })
  }
}

// Get Category by ID
async function getCategoryById(req, res) {
  const { id } = req.params
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true
      }
    })
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' })
    }
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération de la catégorie: ' + error.message
    })
  }
}

// Create a New Category
async function createCategory(req, res) {
  const { name, color, image } = req.body

  try {
    const existingCategoryByColor = await prisma.category.findUnique({
      where: { color }
    })

    if (existingCategoryByColor) {
      return res.status(400).json({ color: ['Une catégorie avec cette couleur existe déjà'] })
    }
    const existingCategoryByName = await prisma.category.findUnique({
      where: { name }
    })

    if (existingCategoryByName) {
      return res.status(400).json({ color: ['Une catégorie avec cette nom existe déjà'] })
    }

    const category = await prisma.category.create({
      data: {
        name,
        color,
        image
      }
    })
    res.status(201).json({
      message: `Catégorie ${category.name} créée avec succès`,
      category
    })
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de la catégorie: ' + error.message
    })
  }
}

// Update a Category by ID
async function updateCategory(req, res) {
  const { id } = req.params
  const { name, color, image } = req.body

  try {
    // Find the existing category by ID
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée' })
    }

    // Check if the new name is unique, excluding the current category
    if (name && name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name }
      })
      if (nameExists) {
        return res.status(400).json({ name: ['Un autre catégorie avec ce nom existe déjà'] })
      }
    }

    // Check if the new color is unique, excluding the current category
    if (color && color !== existingCategory.color) {
      const colorExists = await prisma.category.findUnique({
        where: { color }
      })
      if (colorExists) {
        return res.status(400).json({ color: ['Cette couleur existe déjà'] })
      }
    }

    // Update the category with new data
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        color,
        image
      }
    })

    res.status(200).json({
      message: 'Catégorie mise à jour avec succès',
      category
    })
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la catégorie: ' + error.message
    })
  }
}

// Delete a Category by ID
async function deleteCategory(req, res) {
  const { id } = req.params

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    })
    if (!existingCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée' })
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    })
    res.status(200).json({ message: 'Catégorie supprimée avec succès' })
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la catégorie: ' + error.message
    })
  }
}
async function createManyCategories(req, res) {
  const categories = req.body

  try {
    const upsertPromises = categories.map((category) =>
      prisma.category.upsert({
        where: { id: category.id },
        update: {
          name: category.name,
          color: category.color,
          image: category.image,
          updatedAt: new Date(category.updatedAt).toISOString()
        },
        create: {
          id: category.id,
          name: category.name,
          color: category.color,
          image: category.image,
          createdAt: new Date(category.createdAt).toISOString(),
          updatedAt: new Date(category.updatedAt).toISOString()
        }
      })
    )

    const results = await Promise.all(upsertPromises)

    res.status(200).json({
      message: `${results.length} catégories traitées avec succès`
    })
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création ou mise à jour des catégories: ' + error.message
    })
  }
}

module.exports= {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createManyCategories
}
