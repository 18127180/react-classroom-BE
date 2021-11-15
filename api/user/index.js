const express = require("express");
const router = express.Router();
const userController = require("./userController");

router.post("/", userController.updateProfile);

module.exports = router;
