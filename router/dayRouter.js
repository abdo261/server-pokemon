const {
  getAllDays,
  getDayById,
  createDay,
  updateDay,
  deleteDay,
  getLatestDay,
} = require("../controller/dayController");

const dayRouter = require("express").Router();

dayRouter.get("/", getAllDays);
dayRouter.get("/latest", getLatestDay);
dayRouter.get("/:id", getDayById);
// dayRouter.post('/many', createManyCategories)
dayRouter.post("/", createDay);
dayRouter.put("/:id", updateDay);
dayRouter.delete("/:id", deleteDay);

module.exports = dayRouter;
