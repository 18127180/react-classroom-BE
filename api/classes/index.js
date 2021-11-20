const express = require("express");
const router = express.Router();
const classController = require("./classController");

router.get("/", classController.listClassByUserId);

router.post("/", classController.create);

router.post("/invite_teacher", classController.invite);

router.post("/invite_student", classController.invite_student);

router.get("/detail/:id", classController.getDetailClass);

router.post("/join", classController.joinClass);

router.post("/invitation", classController.checkQueueUser);

router.post("/add-queue", classController.addQueueUser);

router.get("/assignment/:id", classController.listAssignment);

router.post("/assignment", classController.addAssignment);

module.exports = router;
