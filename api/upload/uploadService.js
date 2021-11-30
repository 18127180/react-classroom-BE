const uploadModel = require("./uploadModel");
const xlsx = require("xlsx");

module.exports = {
  uploadClassList(class_id, student_list) {
    uploadModel.uploadClassList(class_id, student_list);
  },
  downloadGradeList: async (class_id) => {
    const result = await uploadModel.getStudentGradeList(class_id);
    const wb = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(result);
    workSheet["A1"]["v"] = "StudentId";
    workSheet["B1"]["v"] = "Grade";
    xlsx.utils.book_append_sheet(wb, workSheet, `download_grade`);
    let exportFileName = `public/template xlsx/download_grade.xlsx`;
    xlsx.writeFile(wb, exportFileName);
    return result;
  },

  uploadGradeList(class_id, grade_list) {
    return uploadModel.uploadGradeList(class_id, grade_list);
  },
};
