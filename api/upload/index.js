const express = require("express");
const router = express.Router();
const uploadController = require("./uploadController");

router.post("/", uploadController.demo);

module.exports = router;
