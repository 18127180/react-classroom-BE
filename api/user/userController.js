const userService = require("./userService");

exports.updateProfile = async (req, res) => {
  const userObj = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    student_id: req.body.student_id,
    id: req.user.id,
  };
  const new_profile = await userService.updateProfile(userObj);
  if (new_profile) {
    res.status(200).json(new_profile);
  } else {
    res.status(500).json({ message: "Error!" });
  }
};
