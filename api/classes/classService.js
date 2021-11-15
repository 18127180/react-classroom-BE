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


const send_single_mail = async (sender_teacher_email, invite_code, call_back_api, template) =>{
  const senderDataUser = await classModel.getUserDataByEmail(sender_teacher_email);
  const classData = await classModel.getClassDataByInviteCode(invite_code);
  if (!senderDataUser || !classData){
    return null;
  }
  sendMail.setApiKey(process.env.KEY_API_EMAIL);
  const msg = {
    to: {
      email: sender_teacher_email,
    },
    from: {
      email: "phucyugi@gmail.com",
      name: "The HCMUS team",
    },
    template_id: template,
    dynamic_template_data: {
      invite_teacher: senderDataUser.first_name + " "+senderDataUser.last_name,
      api_join_class: call_back_api + `email=` + sender_teacher_email + `&invite_code=` + invite_code,
      class_name: classData.name
    },
    hideWarnings: true
  }
  return sendMail.send(msg)
    .then((response) => {
      return true;
    })
    .catch((error) => {
      return false;
    })
}

exports.inviteByMail = async (list_email, invite_code) => {
  const error_list = [];
  for (const item of list_email){
    const isSucess = await send_single_mail(item,invite_code, process.env.CALL_BACK_SEND_MAIL_API, process.env.TEMPLATE_ID);
    if (!isSucess){
      error_list.push(item);
    };
  }
  return error_list;
};

exports.inviteByMailToStudent = async (list_email, invite_code) => {
  const error_list = [];
  for (const item of list_email){
    const isSucess = await send_single_mail(item,invite_code, process.env.CALL_BACK_API_STUDENT, process.env.TEMPLATE_ID_STUDENT);
    if (!isSucess){
      error_list.push(item);
    };
  }
  return error_list;
};

//process.env.CALL_BACK_SEND_MAIL_API + `email=` + senderEmail + `&invite_code=` + invite_code

exports.getDetailClass = async (id) => {
  const data = await classModel.getDetailClass(id);
  data["studentList"] = await classModel.getDataStudentsByClassId(id);
  data["teacherList"] = await classModel.getDataTeachersByClassId(id);
  return data;
};

exports.joinClass = async (email, invite_code) => {
  const dataStudent = await classModel.getUserDataByEmail(email);
  const dataClass = await classModel.getClassDataByInviteCode(invite_code);
  if (!dataClass || !dataStudent) {
    return null;
  }
  const isExistStudent = await classModel.checkExistStudentInClass(dataClass.id, dataStudent.id);
  if (isExistStudent) {
    return null;
  }
  const isExistTeacher = await classModel.checkExistTeacherInClass(dataClass.id, dataStudent.id);
  if (isExistTeacher){
    return null;
  }
  const data = await classModel.joinClass(dataClass.id, dataStudent.id);
  return data;
};
