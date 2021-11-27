const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController");

router.post("/", uploadController.uploadClassList);

module.exports = router;
