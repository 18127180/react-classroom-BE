const userModel = require("./userModel");
const jwt = require("jsonwebtoken");

exports.udpateProfile = async (userObj) => {
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
