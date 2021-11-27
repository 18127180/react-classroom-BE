const fs = require("fs");
const multer = require("multer");
const xlsx = require("xlsx");

//multer store files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage }).single("file");

const schema = {
  STUDENT_ID: {
    // JSON object property name.
    prop: "StudentId",
    type: String,
    requried: true,
  },
  STUDENT_NAME: {
    prop: "FullName",
    type: String,
    required: true,
  },
};

module.exports = {
  demo(req, res, next) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }

      const path = `public/upload/${req.file.filename}`;
      const workbook = xlsx.readFile(path);
      let worksheets = {};

      for (const sheetName of workbook.SheetNames) {
        worksheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      }

      console.log(worksheets.Sheet1);
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      return res.status(200).send(req.file);
    });
  },
};
