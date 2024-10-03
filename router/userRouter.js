const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createManyUsers,
} = require("../controller/userController");

const userRouter = require("express").Router();

userRouter.get("/", getAllUsers);

userRouter.get("/:id", getUserById);

userRouter.post("/", createUser);
userRouter.post("/many", createManyUsers);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
