const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const wordExtractor = require("word-extractor");

const pdfParse = require("pdf-parse");

exports.clearpdf = async (file) => {
  try {
    const buffer = file.buffer;
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

    if (path.extname(file.path) === ".txt") {
      data = await fs.promises.readFile(file.path, "utf8");
    }
    return data;
  } catch (error) {
    throw error;
  }
};
