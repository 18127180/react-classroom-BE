const express = require("express");
const router = express.Router();
const passport = require("../../modules/passport");
const jwt = require("jsonwebtoken");
const pool = require("../../config-db");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);
const authModel = require("./authModel");

let currentUser = {};

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
      id_provider: payload["sub"],
      first_name: payload["given_name"],
      last_name: payload["family_name"],
      avatar: payload["picture"],
      email: payload["email"],
    };
    const isExist = await authModel.checkExistUserThirdParty(payload["sub"]);
    if (!isExist) {
      const isSucess = await authModel.createThirdPartyUser(user);
    }
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

router.post("/facebook", async function (req, res, next) {
  await passport.authenticate(
    "facebook-token",
    async function (err, user, info) {
      if (err) res.status(401);
      if (user) {
        // console.log(user);
        const currentUser = {
          id_provider: user.id,
          first_name: user.name.givenName,
          last_name: user.name.familyName,
          avatar: user.photos[0].value,
          email: user.emails[0].value,
        };
        const isExist = await authModel.checkExistUserThirdParty(
          currentUser.id_provider
        );
        if (!isExist) {
          const isSucess = await authModel.createThirdPartyUser(currentUser);
        }
        res.status(200).json({
          user: currentUser,
          access_token: jwt.sign(
            currentUser,
            process.env.ACCESS_TOKEN_SECRET_KEY,
            {
              expiresIn: "1h",
            }
          ),
        });
      } else {
        res.status(401);
      }
    }
  )(req, res, next);
});

module.exports = router;
