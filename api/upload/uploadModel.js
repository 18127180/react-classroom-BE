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
  async getStudentGradeList(class_id) {
    try {
      const records = await pool.query(
        `select c.student_code as student_id, (null) as grade from class_student_code c where c.class_id = $1`,
        [class_id]
      );
      return records.rows;
    } catch (error) {
      return null;
    }
  },
};

// exports.getStudentGradeList = async (class_id) => {
//   try {
//     const records = await pool.query(
//       `select * from class_student_code c where c.class_id = $1`,
//       [class_id]
//     );
//     return records.rows;
//   } catch (error) {
//     return null;
//   }
// }
