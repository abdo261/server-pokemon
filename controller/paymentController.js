const prisma = require("../utils/db");
const { ValidateCreatePayment } = require("../validation/payment");

// Get All Payments
async function getAllPayments(req, res) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving payments: " + error.message });
  }
}

// Get Payment by ID
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
    res.status(500).json({ message: "Error retrieving payment: " + error.message });
  }
}

// Create Payment
async function createPayment(req, res) {
  const { details, totalPrice, isPayed, isLocal, type } = req.body;

  const { error } = ValidateCreatePayment({ details, totalPrice, isPayed, isLocal, type });
  if (error) {
    return res.status(400).json(error);
  }

  try {
    const payment = await prisma.payment.create({
      data: {
        details: JSON.stringify(details),
        totalPrice,
        isPayed,
        isLocal,
        type,
      },
    });
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment: " + error.message });
  }
}

// Update Payment
async function updatePayment(req, res) {
  const { id } = req.params;
  const { details, totalPrice, isPayed, isLocal, type } = req.body;

  const { error } = ValidateCreatePayment({ details, totalPrice, isPayed, isLocal, type });
  if (error) {
    return res.status(400).json(error);
  }

  try {
    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        details: JSON.stringify(details),
        totalPrice,
        isPayed,
        isLocal,
        type,
      },
    });
    res.status(200).json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment: " + error.message });
  }
}

// Delete Payment
async function deletePayment(req, res) {
  const { id } = req.params;

  try {
    const existingPayment = await prisma.payment.findUnique({ where: { id: parseInt(id) } });
    if (!existingPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await prisma.payment.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment: " + error.message });
  }
}

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
