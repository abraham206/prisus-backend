const express = require("express");
const router = express.Router();
const asyncHandler = require("../asyncHandler").asyncHandler;
const quizController = require("../controller/quiz");
router.put("/save-score/:quizId", asyncHandler(quizController.updateQuiz));
router.get("/get-quiz/:realId", asyncHandler(quizController.getQuiz));
module.exports = router;
