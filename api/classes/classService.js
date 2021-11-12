const classModel = require("./classModel");
const axios = require("axios");

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
  }
  return data;
};

exports.inviteByMail = async (senderEmail, invite_code) => {
  axios({
    method: "post",
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      Authorization: "Bearer " + process.env.KEY_API_EMAIL,
    },
    data: {
      personalizations: [
        {
          to: [
            {
              email: senderEmail,
              name: "abhishek",
            },
          ],
          subject: `SendGrid Template Demo`,
          dynamic_template_data: {
            teacher: "phuc",
            api_join_class: process.env.CALL_BACK_SEND_MAIL_API + `email=` + senderEmail + `&invite_code=` + invite_code,
          },
        },
      ],
      from: {
        email: "phucyugi@gmail.com",
        name: "Okay Dexter",
      },
      template_id: process.env.TEMPLATE_ID,
    },
  });
};

exports.getDetailClass = async (id) => {
  const data = await classModel.getDetailClass(id);
  return data;
};

exports.joinClass = async (email, invite_code, status) => {
  const dataClass = await classModel.getUserDataByEmail(email);
  const dataStudent = await classModel.getClassDataByInviteCode(invite_code);
  if (!dataClass || !dataStudent) {
    return null;
  }
  const isExist = await classModel.checkExistStudentInClass(dataClass.id, dataStudent.id);
  if (isExist) {
    return null;
  }
  const data = await classModel.joinClass(dataClass.id, dataStudent.id, status);
  return data;
}
