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
  const data = await classModel.createClass(classObj);
  if (data) {
    const result = await classModel.createTeacherForClass(teacher_id, data.id);
  }
  return data;
};

exports.inviteByMail = async (senderEmail) => {
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
            api_join_class: "http://localhost:3000/login",
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
