const classModel = require('../classes/classModel')

exports.joinClass = async (email, invite_code) => {
    const dataStudent = await classModel.getUserDataByEmail(email);
    const dataClass = await classModel.getClassDataByInviteCode(invite_code);
    let data = null;
    if (!dataClass || !dataStudent) {
        return null;
    }
    const isExist = await classModel.checkExistTeacherInClass(dataClass.id, dataStudent.id);
    if (isExist) {
        data = {
            id_class: dataClass.id
        }
        return data;
    }
    data = await classModel.joinClassByTeacherRole(dataClass.id, dataStudent.id);
    if (data) {
        data = {
            id_class: dataClass.id
        }
    }
    return data;
}
