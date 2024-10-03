const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createManyProducts,
} = require("../controller/productController");
const { uploadProduct } = require("../middleware/upload");

const productRouter = require("express").Router();

// Route to get all products
productRouter.get("/", getAllProducts);

// Route to get a product by its ID
productRouter.get("/:id", getProductById);


productRouter.post("/",uploadProduct.single('image'), createProduct);

// Route to create or update many products
productRouter.post("/many", createManyProducts);

// Route to update a product by its ID
productRouter.put("/:id",uploadProduct.single('image'), updateProduct);

// Route to delete a product by its ID
productRouter.delete("/:id", deleteProduct);

module.exports = productRouter;
