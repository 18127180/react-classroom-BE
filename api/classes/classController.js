const classService = require("./classService");
const open = require('open');
const jwt = require("jsonwebtoken");
const axios = require("axios");

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
    res.status(404).json({ message: "Error!" });
  }
};

exports.invite = async (req, res) => {
  const isSuccess = classService.inviteByMail(req.body.email, req.body.invite_code);
  console.log(isSuccess);
  if (isSuccess) {
    res.status(201).json({ message: "Send mail success!" });
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.getDetailClass = async (req, res) => {
  const isSuccess = await classService.getDetailClass(req.params.id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.joinClass = async (req, res) => {
  const isSuccess = await classService.joinClass(req.query.email, req.query.invite_code, "ACCESS");
  if (isSuccess) {
    res.status(201).json({ message: "Join class success!" });
  } else {
    res.status(404).json({ message: "Error!" });
  }
}

exports.joinClassByEmail = async (req, res) => {
  const isSuccess = await classService.joinClass(req.query.email, req.query.invite_code, "EMAIL_PENDING");
  if (isSuccess) {
    res.status(201).json({ message: "Join class success!" });
  } else {
    res.status(404).json({ message: "Error!" });
  }
}
