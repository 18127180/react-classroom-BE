const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController");

router.post("/", uploadController.uploadClassList);

router.get("/download/studentlist", uploadController.downloadStudentList);

router.get("/download/grade-list", uploadController.downloadGradeList);

module.exports = router;
