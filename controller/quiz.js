const Quiz = require("../model/quiz");

exports.updateQuiz = async (req, res, next) => {
  try {
    const id = req.params.quizId;
    console.log(id);
    const answeredQuestions = req.body.answeredQuestions;
    const incorrect = req.body.incorrectPercent;
    const percent = req.body.percent;

    console.log(answeredQuestions, "hi");
    const timeTaken = req.body.timeTaken;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      const err = new Error("Could not update data!");
      err.statusCode = 400;
      throw err;
    }
    await Quiz.updateByQuizId(id, answeredQuestions, percent, timeTaken);
    res.status(201).json({ message: "quiz score saved" });
  } catch (error) {
    next(error);
  }
};

exports.getQuiz = async (req, res, next) => {
  const id = req.params.realId;
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    const error = new Error("Could not find the data");
    error.statusCode = 404;
    throw error;
  }

  res.status(201).json({ message: "fetched successfully", quiz: quiz });
};
