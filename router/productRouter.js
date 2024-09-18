const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createManyProducts,
} = require("../controller/productController");

const productRouter = require("express").Router();

// Route to get all products
productRouter.get("/", getAllProducts);

// Route to get a product by its ID
productRouter.get("/:id", getProductById);

// Route to create a new product
productRouter.post("/", createProduct);

// Route to create or update many products
productRouter.post("/many", createManyProducts);

// Route to update a product by its ID
productRouter.put("/:id", updateProduct);

// Route to delete a product by its ID
productRouter.delete("/:id", deleteProduct);

module.exports = productRouter;
