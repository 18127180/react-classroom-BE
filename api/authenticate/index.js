const express = require("express");
const router = express.Router();
const passport = require("../../modules/passport");
const jwt = require("jsonwebtoken");
const pool = require("../../config-db");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);

router.post(
  "/",
  passport.authenticate("normal_login", { session: false }),
  function (req, res) {
    res.json({
      user: req.user,
      token: jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "1h",
      }),
    });
  }
);

router.post("/google", async function (req, res) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.CLIENT_ID_GOOGLE,
    });
    const payload = ticket.getPayload();
    const user = {
      id: payload["sub"],
      first_name: payload["given_name"],
      last_name: payload["family_name"],
      name: payload["email"],
      avatar: payload["picture"],
    };
    res.json({
      user: user,
      token: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "1h",
      }),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/facebook", function (req, res, next) {
  passport.authenticate("facebook-token", function (err, user, info) {
    if (err) res.status(401);
    if (user) {
      res.status(200).json({
        user: user,
        access_token: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: "1h",
        }),
      });
    } else {
      res.status(401);
    }
  })(req, res, next);
});

module.exports = router;
