const Document = require("../model/user-doc");
const path = require("path");

exports.saveDocs = async (file, type, userId) => {
  try {
    console.log(file, "file-uploaded");
    const name = file.originalname;
    const _id = null;
    const size = file.size;
    const timeStamp = Date.now();
    const fileType = path.extname(file.originalname.toLowerCase());
    const doc = new Document(
      _id,
      name,
      type,
      timeStamp,
      userId,
      size,
      fileType,
    );
    await doc.save();
  } catch (error) {
    const err = new Error("Error saving document.");
    err.statusCode = 500;
    throw err;
  }
};
