const paymentStatusRouter = require("express").Router();
const {
  countAllPayments,
  countPaymentsByProduct,
  countPaymentsByOffer,
} = require("../controller/paymentCountsController");
paymentStatusRouter.get("/countAll", countAllPayments);
paymentStatusRouter.get("/countByProducts", countPaymentsByProduct);
paymentStatusRouter.get("/countByOffers", countPaymentsByOffer);

module.exports = paymentStatusRouter;
