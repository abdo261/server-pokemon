const prisma = require("../utils/db");
const {
  ValidateCreatePaymentOffer,
  ValidateUpdatePaymentOffer,
} = require("../validation/paymentOffer");

// Get All PaymentOffers
async function getAllPaymentOffers(req, res) {
  try {
    const paymentOffers = await prisma.paymentOffer.findMany({
      include: {
        offers: true,
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(paymentOffers);
    res.status(200).json(paymentOffers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payment offers: " + error.message });
  }
}
async function getLocalPaymentsOffer(req, res) {
  try {
    const payments = await prisma.paymentOffer.findMany({
      where: {
        order: null,
      },
      include: {
        offers: true,
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payments: " + error.message });
  }
}
async function getEnlinePaymentsOffer(req, res) {
  try {
    const payments = await prisma.paymentOffer.findMany({
      where: {
        order: { not: null },
      },
      include: {
        offers: true,
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payments: " + error.message });
  }
}
// Get a PaymentOffer by ID
async function getPaymentOfferById(req, res) {
  const { id } = req.params;
  try {
    const paymentOffer = await prisma.paymentOffer.findUnique({
      where: { id: parseInt(id) },
      include: {
        offers: true,
        order: true,
      },
    });
    if (!paymentOffer) {
      return res.status(404).json({ message: "Payment offer not found" });
    }
    res.status(200).json(paymentOffer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payment offer: " + error.message });
  }
}

// Create PaymentOffer
async function createPaymentOffer(req, res) {
  const {
    offersIds,
    totalePrice,
    isPayed,
    details,
    delevryPrice,
    clientPhoneNumber,
    delevryId,
    isDelevry,
  } = req.body;
console.log(isDelevry)
  const { error } = ValidateCreatePaymentOffer({
    offersIds,
    totalePrice,
    isPayed,
    clientPhoneNumber,
    delevryId:parseInt(delevryId)
  },{isDelevry:isDelevry});
  if (error) {
    return res.status(400).json(error);
  }

  try {
    const paymentOffer = await prisma.paymentOffer.create({
      data: {
        totalePrice,
        isPayed,
        offers: {
          connect: offersIds.map((o) => ({ id: o })),
        },
        details: JSON.stringify(details),
        delevryPrice,
        clientPhoneNumber,
        delevryId,
      },
      include: {
        offers: true,
        order: true,
      },
    });
    res
      .status(201)
      .json({ message: "Payment offer created successfully", paymentOffer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating payment offer: " + error.message });
  }
}

// Update PaymentOffer
async function updatePaymentOffer(req, res) {
  const { id } = req.params;
  const { totalePrice, isPayed, details } = req.body;
  const offersIds = details ? details.map((e) => e.id) : [];
  const { error } = ValidateUpdatePaymentOffer({
    offersIds,
    totalePrice,
    isPayed,
  });
  if (error) {
    return res.status(400).json(error);
  }

  try {
    const updatedPaymentOffer = await prisma.paymentOffer.update({
      where: { id: parseInt(id) },
      data: {
        totalePrice,
        isPayed,
        // offers: {
        //   set: offersIds.map((o) => ({ id: o })),
        // },
        details: details ? JSON.stringify(details) : undefined,
      },
      include: {
        offers: true,
        order: true,
      },
    });
    res.status(200).json({
      message: "Payment offer updated successfully",
      paymentOffer: updatedPaymentOffer,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment offer: " + error.message });
  }
}

// Delete PaymentOffer
async function deletePaymentOffer(req, res) {
  const { id } = req.params;

  try {
    const existingPaymentOffer = await prisma.paymentOffer.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingPaymentOffer) {
      return res.status(404).json({ message: "Payment offer not found" });
    }

    await prisma.paymentOffer.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Payment offer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting payment offer: " + error.message });
  }
}

module.exports = {
  getAllPaymentOffers,
  getPaymentOfferById,
  createPaymentOffer,
  updatePaymentOffer,
  deletePaymentOffer,
  getEnlinePaymentsOffer,
  getLocalPaymentsOffer,
};
