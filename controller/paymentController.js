const prisma = require("../utils/db");
const {
  ValidateCreatePayment,
  ValidateUpdatePayment,
} = require("../validation/payment");

// Get All Payments
async function getAllPayments(req, res) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        
        order: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    console.log(payments)
    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payments: " + error.message });
  }
}
async function getAllLocalPayments(req, res) {
  try {
    const payments = await prisma.payment.findMany({
      where: { order: null },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payments: " + error.message });
  }
}
async function getEnlinePayments(req, res) {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        order: { not: null },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payments: " + error.message });
  }
}

async function getPaymentById(req, res) {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true,
      },
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payment: " + error.message });
  }
}

// Create Payment
async function createPayment(req, res) {
  const {
    details,
    totalePrice,
    isPayed,
    productsIds,
    clientPhoneNumber,
    delevryId,
    delevryPrice,
    isDelevry,
  } = req.body;

  const { error } = ValidateCreatePayment(
    {
      totalePrice,
      isPayed,
      productsIds,
      clientPhoneNumber,
      delevryId: parseInt(delevryId),
    },
    { isDelevry }
  );
  if (error) {
    return res.status(400).json(error);
  }

  try {
    const payment = await prisma.payment.create({
      data: {
        details: JSON.stringify(details),
        totalePrice,
        isPayed,
        clientPhoneNumber,
        delevryId: parseInt(delevryId),
        products: {
          connect: productsIds.map((p) => ({ id: p })),
        },
        delevryPrice: delevryPrice,
      },
    });
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating payment: " + error.message });
  }
}

// Update Payment
async function updatePayment(req, res) {
  const { id } = req.params;
  const { details, totalePrice, isPayed } = req.body;
  productsIds = details ? details.map((e) => parseInt(p.id)) : [];
  const { error } = ValidateUpdatePayment({
    totalePrice,
    isPayed,
    productsIds,
  });
  if (error) {
    return res.status(400).json(error);
  }

  try {
    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        details: details ? JSON.stringify(details) : undefined,
        isPayed,
      },
      include: { products: true, order: true },
    });
    res.status(200).json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment: " + error.message });
  }
}

// Delete Payment
async function deletePayment(req, res) {
  const { id } = req.params;

  try {
    const existingPayment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await prisma.payment.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting payment: " + error.message });
  }
}

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getAllLocalPayments,
  getEnlinePayments,
};
