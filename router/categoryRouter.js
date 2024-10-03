const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createManyCategories,
  getCategoriesWithCount,
  getAllCategoriesWithProduct,
} = require("../controller/categoryController");
const { getLatestDay } = require("../controller/dayController");
const { uploadCategory } = require("../middleware/upload");

const categoryRouter = require("express").Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/counts", getCategoriesWithCount);
categoryRouter.get("/products", getAllCategoriesWithProduct);

categoryRouter.get("/:id", getCategoryById);

categoryRouter.post("/many", createManyCategories);
categoryRouter.post("/", uploadCategory.single("image"), createCategory);

categoryRouter.put("/:id", uploadCategory.single("image"), updateCategory);

categoryRouter.delete("/:id", deleteCategory);

module.exports = categoryRouter;
