const userService = require("./userService");

async function updateProfile(req, res) {
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
}

async function changePassword(req, res) {
  try {
    const result = await userService.changePassword({ id: req.user.id, ...req.body });
    if (result) {
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
}

module.exports = {
  updateProfile,
  changePassword,
};
