const express = require("express");
const router = express.Router();
const passport = require("../../modules/passport");
const jwt = require("jsonwebtoken");
const pool = require("../../config-db");

router.post(
  "/",
  passport.authenticate("local", { session: false }),
  function (req, res) {
    res.json({
      user: req.user,
      token: jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "1h",
      }),
    });
  }
);

module.exports = router;
