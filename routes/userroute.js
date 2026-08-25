const userController = require("../controller/user");
const express = require("express");
const router = express.Router();
const asyncHandler = require("../asyncHandler").asyncHandler;
const validator = require("../validation/validation-middleware");
const schema = require("../validation/validation-schema");

router.post(
  "/signup",
  validator.validate(schema.signupSchema),
  asyncHandler(userController.createUser),
);
router.get("/getUser", asyncHandler(userController.getUser));
router.delete("/delete-user", asyncHandler(userController.deleteUser));
router.patch(
  "/edit-user",
  validator.validate(schema.editUserSchema),
  asyncHandler(userController.editUser),
);
router.patch(
  "/edit-user-password",
  validator.validate(schema.editPasswordSchema),
  asyncHandler(userController.changeUserPassword),
);

module.exports = router;
