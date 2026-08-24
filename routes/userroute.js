const userController = require("../controller/user");
const express = require("express");
const router = express.Router();
router.post("/signup", userController.createUser);
router.get("/getUser", userController.getUser);
router.delete("/delete-user", userController.deleteUser);
router.patch("/edit-user", userController.editUser);
router.patch("/edit-user-password", userController.changeUserPassword);

module.exports = router;
