const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const wordExtractor = require("word-extractor");

const pdfParse = require("pdf-parse");

exports.clearpdf = async (file) => {
  try {
    const buffer = fs.readFileSync(file.path);
    let data;
    if (path.extname(file.path) === ".pdf") {
      const pdfResult = await pdfParse(buffer);
      data = pdfResult.text;
    }

    if (
      path.extname(file.path) === ".docx" ||
      path.extname(file.path) === ".doc"
    ) {
      const extractor = new wordExtractor();
      const document = await extractor.extract(buffer);
      data = document.getBody();
    }
    return data;
  } catch (error) {
  } finally {
    fs.unlink(req.file.name, (err) => {
      if (err) {
        console.log("Error deleting uploaded file!");
      }
    });
  }
};
