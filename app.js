const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = express();
const cors = require("cors");
const generateroute = require("./routes/generateroute");
const mongoConnect = require("./util/database").mongoConnect;
const userroute = require("./routes/userroute");
const authRoute = require("./routes/authroute");
const isAuth = require("./isAuth");
const errorController = require("./controller/error");
const cookieParser = require("cookie-parser");
const quizRoute = require("./routes/quizroute");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const flashcardRoute = require("./routes/flashcardroute");

app.use(helmet());
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  }),
);

const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: { message: "Too many reuests with this IP, try again in 1 hour" },
});

app.use("/api", limiter);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api", authRoute);

app.use("/api", isAuth, generateroute);

app.use("/api", isAuth, userroute);

app.use("/api", isAuth, quizRoute);

app.use("/api", isAuth, flashcardRoute);

app.use(errorController);
//
mongoConnect();
app.listen(process.env.PORT || 8080, () => {
  console.log(`server is running on port ${process.env.PORT || 8080}`);
});
