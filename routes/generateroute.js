const express = require("express");
const router = express.Router();
const generateData = require("../controller/generatedata");

router.post("/quiz", generateData.generateQuiz);
router.post("/flashcards", generateData.generateFlashCard);
module.exports = router;
