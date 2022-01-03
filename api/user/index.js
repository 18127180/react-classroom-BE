const express = require("express");
const router = express.Router();
const userController = require("./userController");

function isAdmin(req, res, next) {
  console.log(req.user);
  if (req.user.role) {
    console.log("isAdmin");
    next();
  } else res.status(401).send("Admin only");
}

router.post("/", userController.updateProfile);

router.post("/change-password", userController.changePassword);

router.get("/admins", isAdmin, userController.getAdmins);

router.post("/admins", isAdmin, userController.createAdmin);

module.exports = router;
