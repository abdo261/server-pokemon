const paymentStatusRouter = require("express").Router();
const {
  countAllPayments,
  countPaymentsByProduct,
  countPaymentsByOffer,
  countAllPaymentsWithQ,
  countPaymentsByOfferWithQuantity,
  countPaymentsByProductWithQuantity,
} = require("../controller/paymentCountsController");
paymentStatusRouter.get("/countAll", countAllPayments);
paymentStatusRouter.get("/countAllWitheQuantity", countAllPaymentsWithQ);
paymentStatusRouter.get("/countByProducts", countPaymentsByProduct);
paymentStatusRouter.get("/countByOffers", countPaymentsByOffer);
paymentStatusRouter.get("/countByProductsWithQuantity", countPaymentsByProductWithQuantity);
paymentStatusRouter.get("/countByOffersWithQuantity", countPaymentsByOfferWithQuantity);

module.exports = paymentStatusRouter;
