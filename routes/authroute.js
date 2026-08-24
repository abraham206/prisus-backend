const authController = require("../controller/auth");
const express = require("express");
const router = express.Router();

router.post("/auth/signin", authController.signin);
router.get("/auth/refresh", authController.refresh);
router.get("/auth/logout", authController.logout);

module.exports = router;
