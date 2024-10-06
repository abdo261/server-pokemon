const express = require("express");
const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getAllLocalPayments,
  getEnlinePayments
} = require("../controller/paymentController");

const paymentRouter = express.Router();

paymentRouter.get("/", getAllPayments);
paymentRouter.get("/enline", getEnlinePayments);
paymentRouter.get("/locale", getAllLocalPayments);
paymentRouter.get("/:id", getPaymentById);
paymentRouter.post("/", createPayment);
paymentRouter.put("/:id", updatePayment);
paymentRouter.delete("/:id", deletePayment);

module.exports = paymentRouter;
