const express = require("express");
const router = express.Router();
const classController = require("./classController");

router.get("/", classController.list);

router.post("/", classController.create);

module.exports = router;
