const express = require("express");
const router = express.Router();
const asyncHandler = require("../asyncHandler").asyncHandler;
const flashcardController = require("../controller/flashcard");
router.get(
  "/get-flashcard/:realId",
  asyncHandler(flashcardController.getFlashcard),
);
module.exports = router;
