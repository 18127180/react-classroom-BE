const classService = require("./classService");
exports.list = async (req, res) => {
  const classes = await classService.list();
  if (classes) {
    res.status(200).json(classes);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.listClassByUserId = async (req, res) => {
  console.log(req.user);
  const classes = await classService.listClassByUserId(req.user.id);
  if (classes) {
    res.status(200).json(classes);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.create = async (req, res) => {
  const classObj = {
    section: req.body.section,
    topic: req.body.topic,
    room: req.body.room,
    name: req.body.name,
  };
  const isSuccess = await classService.create(classObj);
  if (isSuccess) {
    res.status(201).json({ message: "Class created!" });
  } else {
    res.status(404).json({ message: "Error!" });
  }
};
