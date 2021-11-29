const uploadModel = require("./uploadModel");
const xlsx = require("xlsx");

module.exports = {
  uploadClassList(class_id, student_list) {
    uploadModel.uploadClassList(class_id, student_list);
  },
  // async downloadGradeList(class_id) {
  //   const result = await uploadModel.getStudentGradeList(class_id);
  //   console.log(result);
  //   const test_data = [
  //     {
  //         id: 1,
  //         color: 'red',
  //         number: 75
  //     },
  //     {
  //         id: 2,
  //         color: 'blue',
  //         number: 62
  //     },
  //     {
  //         id: 3,
  //         color: 'yellow',
  //         number: 93
  //     },
  // ];
  //   const wb = xlsx.utils.book_new();
  //   const workSheet = xlsx.utils.json_to_sheet(test_data);
  //   xlsx.utils.book_append_sheet(wb, workSheet, `response`);
  //   let exportFileName = `public/upload/response.xlsx`;
  //   xlsx.writeFile(wb, exportFileName);
  //   return result;
  // },
  downloadGradeList: async (class_id) => {
    const result = await uploadModel.getStudentGradeList(class_id);
    const wb = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(result);
    xlsx.utils.book_append_sheet(wb, workSheet, `download_grade`);
    let exportFileName = `public/upload/download_grade.xlsx`;
    xlsx.writeFile(wb, exportFileName);
    return result;
  }
};