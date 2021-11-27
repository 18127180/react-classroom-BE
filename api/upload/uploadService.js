const uploadModel = require("./uploadModel");

module.exports = {
  uploadClassList(class_id, student_list) {
    uploadModel.uploadClassList(class_id, student_list);
  },
};
