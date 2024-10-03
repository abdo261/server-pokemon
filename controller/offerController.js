const prisma = require("../utils/db");
const { ValidateCreateOffer } = require("../validation/offer");
const { deleteImage } = require("./imageController");

// Get All Offers
async function getAllOffers(req, res) {
  try {
    const offers = await prisma.offer.findMany({
      include: { products: true },
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
  const { price, products } = req.body; // Ensure products are included in the body
  const imagePath = req.file ? `/images/offer/${req.file.filename}` : null;

  const { error } = ValidateCreateOffer({ price:parseFloat(price),products });
  if (error) return res.status(400).json(error);

  try {
    const offer = await prisma.offer.create({
      data: {
        price,
        imageFile: imagePath,
        products: {
          connect: products.map((productId) => ({ id: parseInt(productId) })),
        },
      },include:{
        products:true
      }
    });
    res.status(201).json({ message: "Offer created successfully", offer });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating offer: " + error.message });
  }
}

// Update Offer
async function updateOffer(req, res) {
  const { id } = req.params;
  const { price } = req.body;
  const image = req.file;

  try {
    const existingOffer = await prisma.offer.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingOffer)
      return res.status(404).json({ message: "Offer not found" });

    let imagePath = existingOffer.imageFile;

    if (image) {
      if (existingOffer.imageFile) await deleteImage(existingOffer.imageFile);
      imagePath = `/images/offer/${image.filename}`;
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: parseInt(id) },
      data: { price, imageFile: imagePath },
    });

    res
      .status(200)
      .json({ message: "Offer updated successfully", offer: updatedOffer });
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
