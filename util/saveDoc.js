const Document = require("../model/user-doc");

exports.saveDocs = async (file, type, userId) => {
  try {
    console.log(file, "file-uploaded");
    const name = file.originalname;
    const _id = null;
    const size = file.size;
    const timeStamp = Date.now();
    const fileType = file.mimetype;
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
    console.log(error);
  }
};
