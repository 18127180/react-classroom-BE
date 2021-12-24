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
};

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

exports.getGradeTable = async (req, res) => {
  // console.log(req.body);
  const isSuccess = await classService.getGradeTable(req.query.class_id);
  // const isSuccess = {
  //   "id": 125,
  //   "class_id": 49,
  //   "topic": "Grade Structure",
  //   "description": "ok",
  //   "list_header": [
  //     {
  //       "id": 116,
  //       "grade_structure_id": 125,
  //       "subject_name": "123123",
  //       "grade": 9,
  //       "order": 0,
  //       "finalize": true
  //     },
  //     {
  //       "id": 121,
  //       "grade_structure_id": 125,
  //       "subject_name": "final",
  //       "grade": 100,
  //       "order": 1,
  //       "finalize": true
  //     },
  //     {
  //       "id": 118,
  //       "grade_structure_id": 125,
  //       "subject_name": "ok",
  //       "grade": 20,
  //       "order": 2,
  //       "finalize": true
  //     },
  //     {
  //       "id": 120,
  //       "grade_structure_id": 125,
  //       "subject_name": "final",
  //       "grade": 109,
  //       "order": 3,
  //       "finalize": true
  //     },
  //     {
  //       "id": 119,
  //       "grade_structure_id": 125,
  //       "subject_name": "tên",
  //       "grade": 0,
  //       "order": 4,
  //       "finalize": true
  //     },
  //     {
  //       "id": 117,
  //       "grade_structure_id": 125,
  //       "subject_name": "midterm",
  //       "grade": 20,
  //       "order": 5,
  //       "finalize": true
  //     },
  //     {
  //       "id": 1000,
  //       "subject_name": "Total",
  //       "grade": 258
  //     }
  //   ],
  //   "grade_table_list": [
  //     {
  //       "student_code": "18127165",
  //       "isExist": false,
  //       "list_score": [
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 10,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 1,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 11,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": true
  //         }
  //       ],
  //       "max_score": [
  //         9,
  //         100,
  //         20,
  //         109,
  //         0,
  //         20,
  //         258
  //       ],
  //       "full_name": "Luu Thien Nhan"
  //     },
  //     {
  //       "student_code": "18127180",
  //       "isExist": true,
  //       "list_score": [
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 20,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 1,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 21,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": true
  //         }
  //       ],
  //       "max_score": [
  //         9,
  //         100,
  //         20,
  //         109,
  //         0,
  //         20,
  //         258
  //       ],
  //       "full_name": "Le Hoang Phuc",
  //       "avatar": "https://lh3.googleusercontent.com/a-/AOh14GiLtd5bWyHWMCxTFL8XIU-Koh7HCXJnGooLLmW9Lw=s96-c"
  //     },
  //     {
  //       "student_code": "18127181",
  //       "isExist": true,
  //       "list_score": [
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 10,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 10,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": true
  //         }
  //       ],
  //       "max_score": [
  //         9,
  //         100,
  //         20,
  //         109,
  //         0,
  //         20,
  //         258
  //       ],
  //       "full_name": "Le Hoang Phuc",
  //       "avatar": "https://lh3.googleusercontent.com/a/AATXAJy4FXFlJwzqcZGi6qI1Aad1ZJrQm9LYQnXVA5tl=s96-c"
  //     },
  //     {
  //       "student_code": "18127182",
  //       "isExist": true,
  //       "list_score": [
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 10,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 10,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": true
  //         }
  //       ],
  //       "max_score": [
  //         9,
  //         100,
  //         20,
  //         109,
  //         0,
  //         20,
  //         258
  //       ],
  //       "full_name": "Le Minh Thanh",
  //       "avatar": "https://lh3.googleusercontent.com/a/AATXAJyV-XWKlsCdOvsXIX348PpBdMLFN1qY0Zocz9Z-=s96-c"
  //     },
  //     {
  //       "student_code": "18127183",
  //       "isExist": false,
  //       "list_score": [
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 1,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": null,
  //           "isClickAway": false,
  //           "isChange": false,
  //           "isTotal": false
  //         },
  //         {
  //           "score": 1,
  //           "isClickAway": false,
  //           "isChange": true,
  //           "isTotal": true
  //         }
  //       ],
  //       "max_score": [
  //         9,
  //         100,
  //         20,
  //         109,
  //         0,
  //         20,
  //         258
  //       ],
  //       "full_name": "Le Hoang Phuc 3"
  //     }
  //   ]
  // }
  // const isSuccess = await classService.updateAssignmentOrder(req.user, req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.updateScoreStudent = async (req, res) => {
  const isSuccess = await classService.updateScoreStudentSyllabus(req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getClassPersonal = async (req, res) => {
  const isSuccess = await classService.getGradePersonal(req.query.class_id, req.query.user_id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.addReview = async (req, res) => {
  const isSuccess = await classService.addReview(req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};