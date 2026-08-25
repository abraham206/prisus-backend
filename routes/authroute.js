const authController = require("../controller/auth");
const express = require("express");
const router = express.Router();
const asyncHandler = require('../asyncHandler').asyncHandler

router.post("/auth/signin", asyncHandler(authController.signin));
router.get("/auth/refresh", asyncHandler(authController.refresh));
router.get("/auth/logout", asyncHandler(authController.logout));

module.exports = router;
