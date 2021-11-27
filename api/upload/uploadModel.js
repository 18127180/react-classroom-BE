const pool = require("../../config-db");

module.exports = {
  uploadClassList(class_id, student_list) {
    let sql = "INSERT INTO class_student_code (class_id, student_code, full_name) VALUES";
    const amount = student_list.length;
    student_list.forEach((student, index) => {
      sql += ` (${class_id},${student.StudentId},'${student.FullName}')`;
      if (index !== amount - 1) sql += ",";
    });
    sql += " ON CONFLICT (class_id, student_code) DO NOTHING RETURNING *";
    pool
      .query(sql)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  },
};
