console.log(5);

const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
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
//helmet
//express-mongo-sanitize
//xss-clean
//limit

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: { message: "Too many reuests with this IP, try again in 1 hour" },
});

app.use("/api", limiter);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,"document"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = [
    "application/pdf", //pdf
    "application/msword", //doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //docx
    "application/vnd.ms-powerpoint", //ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", //pptx
    "text/plain", //txt
  ];

  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single("document"),
);

app.use("/document", express.static(path.join(__dirname, "document")));

// Generate quiz middleware

app.use("/api", authRoute);

app.use("/api", isAuth, generateroute);

// user middleware
app.use("/api", isAuth, userroute);

app.use("/api", isAuth, quizRoute);

// Auth middleware
// Error handling
app.use(errorController);

mongoConnect();
app.listen(process.env.PORT || 8080, () => {
  console.log(`server is running on port ${process.env.PORT || 8080}`);
  // console.log(app.get("env"));
});

//////////////////////////////////// Prisus.ai
// Edit User information
// Change password
// Forgot password
// email

////////////////////////////// FUD
// Redesign ui for dashboard
// implement save other users recipe
// profile pic
// integrate map into it
// edit user
// email integration
