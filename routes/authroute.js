const authController = require("../controller/auth");
const express = require("express");
const router = express.Router();
const asyncHandler = require("../asyncHandler").asyncHandler;
const validator = require("../validation/validation-middleware");
const schema = require("../validation/validation-schema");

router.post(
  "/auth/signin",
  validator.validate(schema.signinSchema),
  asyncHandler(authController.signin),
);
router.get("/auth/refresh", asyncHandler(authController.refresh));
router.get("/auth/logout", asyncHandler(authController.logout));

module.exports = router;
