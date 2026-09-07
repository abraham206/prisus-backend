const express = require("express");
const router = express.Router();
const aiService = require("../services/aiService");
const asyncHandler = require("../asyncHandler").asyncHandler;
const upload = require("../util/handlefile");

router.post(
  "/quiz",
  upload.single("document"),
  asyncHandler(aiService.generateQuiz),
);
router.post(
  "/flashcards",
  upload.single("document"),
  asyncHandler(aiService.generateFlashCard),
);
module.exports = router;
