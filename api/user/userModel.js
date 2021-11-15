const pool = require("../../config-db");

exports.updateProfile = async (userObj) => {
  try {
    const records = await pool.query(
      `UPDATE "user" SET first_name=$1,last_name=$2,student_id=$3 WHERE id=$4 RETURNING id,first_name,last_name,email,avatar,student_id`,
      [userObj.first_name, userObj.last_name, userObj.student_id, userObj.id]
    );
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    return err;
  }
};

exports.checkStudentId = async (student_id) => {
  try {
    const records = await pool.query(`SELECT * FROM "user" WHERE student_id=$1`, [student_id]);
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    return err;
  }
};
