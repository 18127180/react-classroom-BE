const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const pool = require("../../config-db");

const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async function (email, password, done) {
      await pool
        .query(
          'SELECT id,first_name,last_name,email FROM "user" WHERE email=$1 and password=$2',
          [email, password]
        )
        .then((result) => {
          if (result.rows.length !== 0) {
            return done(null, result.rows[0]);
          } else {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET_KEY;
passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
  await pool
    .query(
      'SELECT id FROM "user" WHERE id=$1',
      [jwt_payload.id]
    )
    .then((result) => {
      if (result.rows.length !== 0) {
        return done(null, result.rows[0]);
      } else {
        return done(null, false, {
          message: "Invalid token!",
        });
      }
    })
    .catch((err) => {
      return done(err);
    });
}));

// passport.use(new MailruStrategy({
//   clientID: "780592097647-hif1svldddrkc4jpojqc44paile3l8da.apps.googleusercontent.com",
//   clientSecret: "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",
//   callbackURL: "http://localhost:3000/"
// },
//   function (accessToken, refreshToken, profile, cb) {
//     return null;
//   }
// ));

passport.use(new GoogleStrategy({
  clientID: "780592097647-hif1svldddrkc4jpojqc44paile3l8da.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:3000"
},
  function (token, tokenSecret, profile, done) {
    console.log(token);
    console.log(tokenSecret);
    console.log(profile);
    return done(null, {});
  }
));
module.exports = passport;
