const express = require("express");
const router = express.Router();
const classController = require("./classController");

const validateJWT = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Invalid Token" });
  } else next();
};

router.get("/", validateJWT, classController.list);

router.post("/", validateJWT, classController.create);

module.exports = router;
