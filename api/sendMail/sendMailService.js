const classModel = require('../classes/classModel')

//can xu ly
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
    const isExistStudent = await classModel.checkExistStudentInClass(dataClass.id, dataStudent.id);
    console.log(isExistStudent);
    if (isExistStudent) {
        const result = await classModel.removeStudentInClass(dataClass.id, dataStudent.id);
        console.log(result);
    }
    data = await classModel.joinClassByTeacherRole(dataClass.id, dataStudent.id);
    if (data) {
        data = {
            id_class: dataClass.id
        }
    }
    return data;
}


exports.joinClassByStudentRole = async (email, invite_code) => {
    const dataStudent = await classModel.getUserDataByEmail(email);
    const dataClass = await classModel.getClassDataByInviteCode(invite_code);
    let data = null;
    if (!dataClass || !dataStudent) {
        return null;
    }
    const isExist = await classModel.checkExistStudentInClass(dataClass.id, dataStudent.id);
    if (isExist) {
        data = {
            id_class: dataClass.id
        }
        return data;
    }
    const isExistTeacher = await classModel.checkExistTeacherInClass(dataClass.id, dataStudent.id);
    if (isExistTeacher){
        data = {
            id_class: dataClass.id
        }
        return data;
    }
    data = await classModel.joinClass(dataClass.id, dataStudent.id);
    if (data) {
        data = {
            id_class: dataClass.id
        }
    }
    return data;
}