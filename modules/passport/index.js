const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const pool = require("../../config-db");

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

module.exports = passport;
