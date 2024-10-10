const {
  getAllDays,
  getDayById,
  createDay,
  updateDay,
  deleteDay,
  getLatestDay,
  countAllPaymentsForDay,
  countAllPaymentsWithDayRange,
  countAllPaymentsForDateRangeWithQ,
} = require("../controller/dayController");

const dayRouter = require("express").Router();

dayRouter.get("/", getAllDays);
dayRouter.get("/latest", getLatestDay);
dayRouter.get("/:id", getDayById);
dayRouter.get("/count/:dayId", countAllPaymentsForDay);
dayRouter.get("/countAllPaymentWithQ/:dayId", countAllPaymentsForDateRangeWithQ);
dayRouter.get("/countCountAllPaymentsWithDayRange/:dayId", countAllPaymentsWithDayRange);
// dayRouter.post('/many', createManyCategories)
dayRouter.post("/", createDay);
dayRouter.put("/:id", updateDay);
dayRouter.delete("/:id", deleteDay);

module.exports = dayRouter;
