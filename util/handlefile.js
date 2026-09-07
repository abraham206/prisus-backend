const multer = require("multer");

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = [
    "application/pdf", //pdf
    "application/msword", //doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //docx
    "text/plain", //txt
  ];

  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = upload;
