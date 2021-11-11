const express = require("express");
const router = express.Router();
const classController = require("./classController");

const validateJWT = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Invalid Token" });
  } else next();
};

router.get("/", validateJWT, classController.listClassByUserId);

router.post("/", validateJWT, classController.create);

router.post("/invite", classController.invite);

router.get("/detail/:id", classController.getDetailClass);

module.exports = router;
