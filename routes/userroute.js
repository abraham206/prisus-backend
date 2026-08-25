const userController = require("../controller/user");
const express = require("express");
const router = express.Router();
const asyncHandler = require("../asyncHandler").asyncHandler;

router.post("/signup", asyncHandler(userController.createUser));
router.get("/getUser", asyncHandler(userController.getUser));
router.delete("/delete-user", asyncHandler(userController.deleteUser));
router.patch("/edit-user", asyncHandler(userController.editUser));
router.patch(
  "/edit-user-password",
  asyncHandler(userController.changeUserPassword),
);

module.exports = router;
