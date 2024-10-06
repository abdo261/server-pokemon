const express = require("express");
const {
  getAllPaymentOffers,
  createPaymentOffer,
  deletePaymentOffer,
  getPaymentOfferById,
  updatePaymentOffer,
  getEnlinePaymentsOffer,
  getLocalPaymentsOffer,
} = require("../controller/paymentOfferController");

const paymentOfferRouter = express.Router();

paymentOfferRouter.get("/", getAllPaymentOffers);
paymentOfferRouter.get("/enline", getEnlinePaymentsOffer);
paymentOfferRouter.get("/locale", getLocalPaymentsOffer);
paymentOfferRouter.get("/:id", getPaymentOfferById);
paymentOfferRouter.post("/", createPaymentOffer);
paymentOfferRouter.put("/:id", updatePaymentOffer);
paymentOfferRouter.delete("/:id", deletePaymentOffer);

module.exports = paymentOfferRouter;
