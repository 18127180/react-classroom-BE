const userModel = require("./userModel");
const jwt = require("jsonwebtoken");

exports.udpateProfile = async (userObj) => {
  const data = await userModel.updateProfile(userObj);
  if (data) {
    return {
      user: data,
      access_token: jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "1h",
      }),
    };
  }
  return null;
};
