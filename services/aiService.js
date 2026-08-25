const clearpdf = require("./document").clearpdf;
const OpenAi = require("openai");
const client = new OpenAi({
  apiKey: `${process.env.OPENAI_KEY}`,
  baseURL: "https://openrouter.ai/api/v1",
});
const path = require("path");
const Quiz = require("../model/quiz");
const User = require("../model/user");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

exports.generateQuiz = async (req, res, next) => {
  try {
    const { nanoid } = await import("nanoid");
    const FakeId = nanoid();

    if (!req.file) {
      const err = new Error("No file Included!");
      err.statusCode = 400;
      throw err;
    }
    const data = await clearpdf(req.file);
    const baseName = path.basename(req.file.path);
    const totalQuestion = req.body.numbers;
    const difficulty = req.body.mode;
    const duration = req.body.duration * 60;
    const timeStamp = Date.now();
    const timeStampDate = new Date(timeStamp);
    const month = timeStampDate.getMonth();
    const day = timeStampDate.getDay();
    const year = timeStampDate.getFullYear();
    const hours = timeStampDate.getHours();
    const mins = timeStampDate.getMinutes();
    const time = `${hours}:${mins} ${hours < 13 ? "AM" : "PM"}`;
    const answeredQuestions = [];
    const score = 0;
    const timeTaken = 0;
    const fileType = path.extname(req.file.path);

    const response = await client.chat.completions.create({
      model: "google/gemma-4-26b-a4b-it:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI that generates multiple-choice questions.",
        },
        {
          role: "user",
          content: `You are a quiz generation AI.

            Generate exactly ${totalQuestion}} multiple-choice questions based ONLY on the provided document and set difficulty to ${difficulty}.

            Return ONLY valid JSON.

            Rules:
            1. Do not include markdown.
            2. Do not wrap the JSON in  or backticks.
            3. Do not include any explanation before or after the JSON.
            4. The root object MUST always have a single property called "questions".
            5. The value of "questions" MUST always be an array.
            6. Every question object MUST have exactly these properties:
              - question (string)
              - options (array of exactly 4 strings)
              - answer (string)
              - explanation (string)
            7. The answer must exactly match one of the values in the options array.
            8. If the document does not contain enough information, generate as many valid questions as possible and return them in the same format.
            9. Never return an array as the root element.
            10. Never add extra properties.

            Expected format:

            {
              "questions": [
                {
                  "question": "What is ...?",
                  "options": [
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D"
                  ],
                  "answer": "Option A",
                  "explanation": "Explanation of why Option A is correct."
                }
              ]
            }

            Document:
            ${data}`,
        },
      ],
    });

    if (!response) {
      const error = new Error("Something Went Wrong!");
      error.statusCode = 500;
      throw error;
    }

    const parsed = JSON.parse(response.choices[0].message.content);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || [];
    const quiz = new Quiz(
      JSON.parse(response.choices[0].message.content).questions,
      req.user?.id,
      difficulty,
      duration,
      baseName,
      `${months[month]} ${day}, ${year}`,
      time,
      FakeId,
      answeredQuestions,
      score,
      timeTaken,
      fileType,
    );
    await quiz.save();
    const user = await User.findById(req.user.id);
    let verified = user.verified;
    if (user.quizCreated.length >= 15) {
      verified = true;
    } else {
      verified = false;
    }

    const userQuiz = user.quizCreated;
    userQuiz.push({
      ...JSON.parse(response.choices[0].message.content),
      quizTime: duration,
      difficulty: difficulty,
      name: baseName,
      date: `${months[month]} ${day}, ${year}`,
      time: time,
      id: FakeId,
      answeredQuestions: answeredQuestions,
      score: score,
      timeTaken: timeTaken,
      fileType: fileType,
    });

    await User.updateQuizCreated(req.user?.id, userQuiz, verified);
    res.status(200).json({
      ...JSON.parse(response.choices[0].message.content),
      quizTime: duration,
      difficulty: difficulty,
      name: baseName,
      date: `${months[month]} ${day}, ${year}`,
      time: time,
      id: FakeId,
      fileType: fileType,
    });
  } catch (err) {
    next(err);
  }
};

exports.generateFlashCard = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error("No file Included!");
      err.statusCode = 400;
      throw err;
    }

    const data = await clearpdf(req.file);
    const response = await client.chat.completions.create({
      model: "google/gemma-4-26b-a4b-it:free",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI that generates flashcards.",
        },

        {
          role: "user",
          content: `
        You are an educational flashcard generator.
        Based ONLY on the study material below, generate 10 usefull flashcards.
        Each flashcards must contain:
        - question: a clear question about an important concept.
        - answer: a concise but accurate answer.

        Focus on important concepts, definitions, principles and relationships.
        Do not invent information that isn't included in the material.
            1. Do not include markdown.
            2. Do not wrap the JSON in  or backticks.
            3. Do not include any explanation before or after the JSON.

        Return only valid JSON in this format:

        {
          "flashcards":[
              {
                  "question":"What is active transport?",
                  "answer":"Active transport is the movement of subtances accross a membrane against their concentration gradient using energy."
              }
          ]
        }

        Study Material: ${data}
         `,
        },
      ],
    });
    res.status(201).json({
      flashcards: JSON.parse(response.choices[0].message.content),
      message: "fetched succsessfully",
    });
  } catch (error) {
    next(error);
  }
};
