const express = require("express");
const router = express.Router();
const sendMailController = require('./sendMailController');

router.get("/",sendMailController.joinClassByEmail);

router.get("/invite-student",sendMailController.joinClassByEmailStudent)

module.exports = router;
