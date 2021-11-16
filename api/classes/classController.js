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
  const classes = await classService.listClassByUserId(req.user.id);
  if (classes) {
    res.status(200).json(classes);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.create = async (req, res) => {
  const classObj = {
    name: req.body.name,
    section: req.body.section,
    topic: req.body.topic,
    description: req.body.description,
  };
  const isSuccess = await classService.create(req.user.id, classObj);
  if (isSuccess) {
    res.status(201).json(isSuccess);
  } else {
    res.status(500).json({ message: "Error!" });
  }
};

exports.invite = async (req, res) => {
  const error_list = await classService.inviteByMail(req.body.list_email, req.body.invite_code);
  if (!error_list.length) {
    res.status(201).json({ message: "Send mail success!" });
  } else {
    res.status(404).json({ message: "Error!", list_error: error_list });
  }
};

exports.invite_student = async (req, res) => {
  const error_list = await classService.inviteByMailToStudent(
    req.body.list_email,
    req.body.invite_code
  );
  if (!error_list.length) {
    res.status(201).json({ message: "Send mail success!" });
  } else {
    res.status(404).json({ message: "Error!", list_error: error_list });
  }
};

exports.getDetailClass = async (req, res) => {
  const isSuccess = await classService.getDetailClass(req.params.id, req.user.id);
  if (isSuccess) {
    if (isSuccess == 403)
    {
      res.status(403).json({message: "Dont have permission"});
    }else{
      res.status(200).json(isSuccess);
    }
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.joinClass = async (req, res) => {
  const isSuccess = await classService.joinClass(req.body.email, req.body.invite_code);
  if (isSuccess) {
    res.status(201).json({ message: "Join class success!" });
  } else {
    res.status(404).json({ message: "Error!" });
  }
};
