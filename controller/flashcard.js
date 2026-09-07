const FlashCard = require("../model/flashcard");

exports.getFlashcard = async (req, res, next) => {
  try {
    const { realId } = req.params;
    console.log(realId, "realId");
    const flashcard = await FlashCard.findById(realId, req.user.id);

    if (!flashcard) {
      const err = new Error("No flashcard was found!!");
      err.statusCode = 404;
      throw err;
    }

    res
      .status(200)
      .json({ message: "Fetched Successfully", flashcards: flashcard });
  } catch (error) {
    next(error);
  }
};
