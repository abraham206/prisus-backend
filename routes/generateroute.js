const express = require("express");
const router = express.Router();
const aiService = require("../services/aiService");
const asyncHandler = require("../asyncHandler").asyncHandler;

router.post("/quiz", asyncHandler(aiService.generateQuiz));
router.post("/flashcards", asyncHandler(aiService.generateFlashCard));
module.exports = router;
