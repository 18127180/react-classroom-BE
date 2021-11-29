const fs = require("fs");
const multer = require("multer");
const xlsx = require("xlsx");
const uploadService = require("./uploadService");

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

module.exports = {
  uploadClassList(req, res, next) {
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

      uploadService.uploadClassList(req.body.id, worksheets.Sheet1);
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      return res.status(200).send(req.file);
    });
    
  },
  downloadStudentList: (req, res, next) => {
    const file = `public/template xlsx/demo ds lớp.xlsx`;
    res.download(file); // Set disposition and send it.
  },
  downloadGradeList : async (req, res) => {
    const result = await uploadService.downloadGradeList(req.query.class_id);
    if (result) {
      const file = `public/upload/grade_download.xlsx`;
      res.download(file);
    } else {
      res.status(500).json({ message: "not ok" });
    }
  }
};
