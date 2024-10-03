const {
  getImageCategoryByName,
  getImageProductByName,
  getImageOfferByName,
} = require("../controller/imageController");

const imageRouter = require("express").Router();

imageRouter.get("/category/:name", getImageCategoryByName);
imageRouter.get("/product/:name", getImageProductByName);
imageRouter.get("/offer/:name", getImageOfferByName);
module.exports = imageRouter;
