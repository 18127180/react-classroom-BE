const classModel = require("./classModel");
const axios = require("axios");
const sendMail = require("@sendgrid/mail");
const { response } = require("../../app");

exports.list = async () => {
  const data = await classModel.list();
  return data;
};

exports.listClassByUserId = async (userId) => {
  const data = await classModel.listClassByUserId(userId);
  return data;
};

exports.create = async (teacher_id, classObj) => {
  classObj["invitecode"] = Math.random().toString(36).substring(2, 8);
  const data = await classModel.createClass(classObj);
  if (data) {
    const result = await classModel.createTeacherForClass(teacher_id, data.id);
    if (result) return null;
  }
  return data;
};

exports.inviteByMail = async (sender_teacher_email, invite_code) => {
  const senderDataUser = await classModel.getUserDataByEmail(
    sender_teacher_email
  );
  const classData = await classModel.getClassDataByInviteCode(invite_code);
  sendMail.setApiKey(process.env.KEY_API_EMAIL);
  const msg = {
    to: {
      email: sender_teacher_email,
    },
    from: {
      email: "phucyugi@gmail.com",
      name: "The HCMUS team",
    },
    template_id: process.env.TEMPLATE_ID,
    dynamic_template_data: {
      invite_teacher:
        senderDataUser.first_name + " " + senderDataUser.last_name,
      api_join_class:
        process.env.CALL_BACK_SEND_MAIL_API +
        `email=` +
        sender_teacher_email +
        `&invite_code=` +
        invite_code,
      class_name: classData.name,
    },
  };
  sendMail
    .send(msg)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return null;
    });
};

//process.env.CALL_BACK_SEND_MAIL_API + `email=` + senderEmail + `&invite_code=` + invite_code

exports.getDetailClass = async (id) => {
  const data = await classModel.getDetailClass(id);
  data["studentList"] = await classModel.getDataStudentsByClassId(id);
  data["teacherList"] = await classModel.getDataTeachersByClassId(id);
  return data;
};

exports.joinClass = async (email, invite_code) => {
  const dataClass = await classModel.getUserDataByEmail(email);
  const dataStudent = await classModel.getClassDataByInviteCode(invite_code);
  if (!dataClass || !dataStudent) {
    return null;
  }
  const isExist = await classModel.checkExistStudentInClass(
    dataClass.id,
    dataStudent.id
  );
  if (isExist) {
    return null;
  }
  const data = await classModel.joinClass(dataClass.id, dataStudent.id);
  return data;
};
