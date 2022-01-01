const userModel = require("./userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.updateProfile = async (userObj) => {
  const ifExistStudentId = await userModel.checkStudentId(userObj.student_id);
  if (ifExistStudentId && ifExistStudentId.id !== userObj.id) return null;
  else {
    const data = await userModel.updateProfile(userObj);
    if (data) {
      return {
        user: data,
        access_token: jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: "1h",
        }),
      };
    }
  }
  return null;
};

exports.changePassword = async (userObj) => {
  const user = await userModel.getUser(userObj.id);
  if (!user) return null;

  const result = await bcrypt.compare(userObj["current-password"], user.password);
  if (!result) return null;

  const salt = await bcrypt.genSalt(10);
  const hashPasword = await bcrypt.hash(userObj["new-password"], salt);
  await userModel.changePassword(userObj.id, hashPasword);
  return true;
};
