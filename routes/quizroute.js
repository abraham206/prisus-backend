const express = require("express");
const router = express.Router();
const quizController = require("../controller/quiz");
router.put("/save-score/:quizId", quizController.updateQuiz);
router.get("/get-quiz/:realId", quizController.getQuiz);
module.exports = router;
