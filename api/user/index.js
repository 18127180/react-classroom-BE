const express = require("express");
const router = express.Router();
const userController = require("./userController");

router.post("/", userController.updateProfile);

router.post("/change-password", userController.changePassword);

module.exports = router;
