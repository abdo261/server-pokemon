const prisma = require("../utils/db");
const { ValidateCreateOffer } = require("../validation/offer");

const { deleteImage, renameImage } = require("./imageController");
const path = require("path");
const fs = require("fs");
// Get All Offers
async function getAllOffers(req, res) {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        products: {
          select: {
            name: true,
            category: {
              select: { name: true },
            },
            type: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
 
    res.status(200).json(offers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving offers: " + error.message });
  }
}

// Get Offer by ID
async function getOfferById(req, res) {
  const { id } = req.params;
  try {
    const offer = await prisma.offer.findUnique({
      where: { id: parseInt(id) },
      include: { products: true },
    });
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.status(200).json(offer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving offer: " + error.message });
  }
}

// Create Offer
async function createOffer(req, res) {
  const { price, products, isPublish, name } = req.body; // Ensure products are included in the body
  const imagePath = req.file ? `/images/offer/${req.file.filename}` : null;
  const { error } = ValidateCreateOffer({
    price: parseFloat(price),
    products,
    name,
  });
  if (error) return res.status(400).json(error);

  try {
    const offer = await prisma.offer.create({
      data: {
        name,
        price,
        imageFile: imagePath,
        products: {
          connect: products.map((productId) => ({ id: parseInt(productId) })),
        },
        isPublish: isPublish === "true",
      },
      include: {
        products: {
          select: {
            name: true,
            category: {
              select: { name: true },
            },
            type: true,
          },
        },
      },
    });
    res.status(201).json({ message: "Offer created successfully", offer });
  } catch (error) {

    res.status(500).json({ message: "Error creating offer: " + error.message });
  }
}
// Update an Offer by ID
async function updateOffer(req, res) {
  const { id } = req.params;
  const { price, products, isPublish, name } = req.body; // Include isPublish from the request body
  const { error } = ValidateCreateOffer({
    price: parseFloat(price),
    products,
    name,
  });
  if (error) {
    return res.status(400).json(error);
  }

  try {
    // Find the existing offer
    const existingOffer = await prisma.offer.findUnique({
      where: { id: parseInt(id) },
      include: { products: true }, // Include products to access current related products
    });

    if (!existingOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    let imagePath = existingOffer.imageFile; // Keep the existing image path

    // Handle new image upload
    if (req.file) {
      // Delete the old image if it exists
      if (existingOffer.imageFile) {
        await deleteImage(existingOffer.imageFile);
      }
      imagePath = `/images/offer/${name}${path.extname(req.file.originalname)}`; // Use the name directly without a date

      await fs.promises.rename(
        req.file.path,
        path.join(__dirname, "..", imagePath)
      ); // Move the new image to the correct directory
    }
    // If the incoming request indicates to set imageFile to "null"
    else if (req.body.imageFile === "null" && existingOffer.imageFile) {
      await deleteImage(existingOffer.imageFile); // Delete image if specified to do so
      imagePath = null; // No image associated with the offer
    }
    // Handle name change with existing image
    else if (name && name !== existingOffer.name && existingOffer.imageFile) {
      const oldImagePath = existingOffer.imageFile;

      const newImagePath = `/images/offer/${name}${path.extname(oldImagePath)}`; // Use the new name without a date
      if (oldImagePath !== newImagePath) {
        await renameImage(oldImagePath, newImagePath); // Rename the existing image if the name has changed
        imagePath = newImagePath; // Update to the new image path
      } else if (req.body.imageFile === "null" && existingOffer.imageFile) {
        await deleteImage(existingOffer.imageFile);
        imagePath = null;
      }
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price,
        imageFile: imagePath,
        isPublish: isPublish === "true",
        products: {
          set: products.map((productId) => ({ id: parseInt(productId) })),
        },
      },
    });

    res.status(200).json({
      message: "L'offre a été mise à jour avec succès!",
      offer: updatedOffer,
    });
  } catch (error) {

    res.status(500).json({ message: "Error updating offer: " + error.message });
  }
}

// Delete Offer
async function deleteOffer(req, res) {
  const { id } = req.params;
  try {
    const existingOffer = await prisma.offer.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingOffer)
      return res.status(404).json({ message: "Offer not found" });

    if (existingOffer.imageFile) await deleteImage(existingOffer.imageFile);
    await prisma.offer.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting offer: " + error.message });
  }
}

module.exports = {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};
