const express = require("express");
const router = express.Router();
const sendMailController = require('./sendMailController');

router.get("/",sendMailController.joinClassByEmail);

module.exports = router;
