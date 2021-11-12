const classModel = require('../classes/classModel')

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
    let data = await classModel.joinClass(dataClass.id, dataStudent.id, status);
    if (data) {
      data = {
        id_class: dataClass.id
      }
    }
    return data;
  }
  