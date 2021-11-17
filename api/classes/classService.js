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
    if (result) return data;
  }
  return null;
};

const send_single_mail = async (
  sender_teacher_email,
  invite_code,
  call_back_api,
  template,
  role
) => {
  const senderDataUser = await classModel.getUserDataByEmail(sender_teacher_email);
  let nameUser = "";
  if (!senderDataUser) {
  } else {
    nameUser = senderDataUser.first_name + " " + senderDataUser.last_name;
  }
  const classData = await classModel.getClassDataByInviteCode(invite_code);
  if (!classData) {
    return null;
  }
  if (role == "TEACHER" && senderDataUser) {
    const checkExistTeacher = await classModel.checkExistTeacherInClass(
      classData.id,
      senderDataUser
    );
    if (checkExistTeacher) return null;
  }
  if (role == "STUDENT" && senderDataUser) {
    const checkExistStudent = await classModel.checkExistStudentInClass(
      classData.id,
      senderDataUser
    );
    if (checkExistStudent) return null;
  }
  const isExist = await classModel.checkQueueUser(sender_teacher_email, classData.id, role);
  if (!isExist) {
    const result = await classModel.addQueueUser(sender_teacher_email, role, classData.id);
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
      invite_teacher: nameUser,
      api_join_class: call_back_api + `email=` + sender_teacher_email + `&class_id=` + classData.id,
      class_name: classData.name,
    },
    hideWarnings: true,
  };
  return sendMail
    .send(msg)
    .then((response) => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};

exports.inviteByMail = async (list_email, invite_code) => {
  const error_list = [];
  for (const item of list_email) {
    const isSucess = await send_single_mail(
      item.email,
      invite_code,
      process.env.NODE_ENV === "production"
        ? process.env.CALL_BACK_SEND_MAIL_API_PROD
        : process.env.CALL_BACK_SEND_MAIL_API,
      process.env.TEMPLATE_ID,
      "TEACHER"
    );
    if (!isSucess) {
      error_list.push(item);
    }
  }
  return error_list;
};

exports.inviteByMailToStudent = async (list_email, invite_code) => {
  const error_list = [];
  for (const item of list_email) {
    console.log(item.email);
    const isSucess = await send_single_mail(
      item.email,
      invite_code,
      process.env.NODE_ENV === "production"
        ? process.env.CALL_BACK_API_STUDENT_PROD
        : process.env.CALL_BACK_API_STUDENT,
      process.env.TEMPLATE_ID_STUDENT,
      "STUDENT"
    );
    if (!isSucess) {
      error_list.push(item);
    }
  }
  return error_list;
};

//process.env.CALL_BACK_SEND_MAIL_API + `email=` + senderEmail + `&invite_code=` + invite_code

exports.getDetailClass = async (id, user_id) => {
  const data = await classModel.getDetailClass(id);
  data["studentList"] = await classModel.getDataStudentsByClassId(id);
  data["teacherList"] = await classModel.getDataTeachersByClassId(id);
  if (data.studentList.find((s) => s.id == user_id)) {
    data["isTeacher"] = false;
  } else if (data.teacherList.find((t) => t.id == user_id)) {
    data["isTeacher"] = true;
  } else {
    return null;
  }
  // const isExist = await classModel.checkExistTeacherInClass(id,user_id);
  // if (isExist)
  // {
  //   data["isTeacher"] = true;
  // }else{
  //   data["isTeacher"] = false;
  // }
  return data;
};

exports.joinClass = async (email, invite_code) => {
  const dataStudent = await classModel.getUserDataByEmail(email);
  const dataClass = await classModel.getClassDataByInviteCode(invite_code);
  let data = null;
  if (!dataClass || !dataStudent) {
    return null;
  }
  const isExist = await classModel.checkExistStudentInClass(dataClass.id, dataStudent.id);
  if (isExist) {
    data = {
      id_class: dataClass.id,
    };
    return data;
  }
  const isExistTeacher = await classModel.checkExistTeacherInClass(dataClass.id, dataStudent.id);
  if (isExistTeacher) {
    data = {
      id_class: dataClass.id,
    };
    return data;
  }
  data = await classModel.joinClass(dataClass.id, dataStudent.id);
  if (data) {
    data = {
      id_class: dataClass.id,
    };
  }
  return data;
};

exports.checkQueueUser = async (email, class_id, role) => {
  const result = await classModel.checkQueueUser(email, class_id, role);
  if (result) {
    const studentList = await classModel.getDataStudentsByClassId(class_id);
    const teacherList = await classModel.getDataTeachersByClassId(class_id);
    const dataClass = await classModel.getClassDataById(class_id);
    if (!dataClass) {
      return null;
    }
    return {
      studentNum: studentList?.length,
      teacherNum: teacherList?.length,
      name: dataClass?.name,
    };
  }
  return result;
};

exports.addQueueUser = async (email, class_id, role) => {
  const dataUser = await classModel.getUserDataByEmail(email);
  if (!dataUser) {
    return null;
  }
  const isExistStudent = await classModel.checkExistStudentInClass(class_id, dataUser.id);
  const isExistTeacher = await classModel.checkExistTeacherInClass(class_id, dataUser.id);
  if (isExistStudent || isExistTeacher) {
    return null;
  }
  const isExist = await classModel.checkQueueUser(email, class_id, role);
  let result = true;
  const studentList = await classModel.getDataStudentsByClassId(class_id);
  const teacherList = await classModel.getDataTeachersByClassId(class_id);
  const dataClass = await classModel.getClassDataById(class_id);
  if (!dataClass) {
    return null;
  }
  if (!isExist) {
    result = await classModel.addQueueUser(email, role, class_id);
    return {
      studentNum: studentList?.length,
      teacherNum: teacherList?.length,
      name: dataClass?.name,
    };
  }
  return {
    studentNum: studentList?.length,
    teacherNum: teacherList?.length,
    name: dataClass?.name,
  };
};
