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
    if (isSuccess == 403) {
      res.status(403).json({ message: "Dont have permission" });
    } else {
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

exports.checkQueueUser = async (req, res) => {
  const isSuccess = await classService.checkQueueUser(
    req.body.email,
    req.body.class_id,
    req.body.role
  );
  if (isSuccess) {
    console.log(isSuccess);
    res.status(200).json(isSuccess);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.addQueueUser = async (req, res) => {
  const isSuccess = await classService.addQueueUser(
    req.body.email,
    req.body.class_id,
    req.body.role
  );
  if (isSuccess) {
    console.log(isSuccess);
    res.status(200).json(isSuccess);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.listAssignment = async (req, res) => {
  const record = await classService.listAssignment(req.user, req.params.id);
  if (record) {
    res.status(200).json(record[1]);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.deleteAssignment = async (req, res) => {
  const record = await classService.deleteAssignment(req.user, req.params);
  if (record) {
    res.status(200).json({ message: "ok" });
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.addAssignment = async (req, res) => {
  const isSuccess = await classService.addAssignment(req.user, req.body);
  if (isSuccess) {
    res.status(201).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.updateAssignment = async (req, res) => {
  const isSuccess = await classService.updateAssignment(req.user, req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.updateAssignmentOrder = async (req, res) => {
  const isSuccess = await classService.updateAssignmentOrder(req.user, req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getGradeStructure = async (req, res) => {
  const isSuccess = await classService.getGradeStructure(req.query.class_id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(400).json({ message: "Bad request" });
  }
}

exports.updateGradeStructure = async (req, res) => {
  // console.log(req.body);
  const isSuccess = await classService.updateGradeStructure(req.body);
  // const isSuccess = await classService.updateAssignmentOrder(req.user, req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};