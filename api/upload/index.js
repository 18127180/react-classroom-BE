const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController");

router.post("/", uploadController.uploadClassList);

router.get("/download/studentlist", uploadController.downloadStudentList);

module.exports = router;
