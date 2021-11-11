const pool = require("../../config-db");

exports.list = async () => {
  try {
    const records = await pool.query("SELECT * FROM classroom");
    return records.rows;
  } catch (err) {
    return err;
  }
};

exports.listClassByUserId = async (userId) => {
  try {
    const records = await pool.query(
      "select * from classroom c inner join (select a.class_id as teach,b.class_id as student from (select class_id from class_student where student_id = $1) a full join (select class_id from class_teacher where teacher_id = $1 ) b on a.class_id=b.class_id) d on c.id=d.teach or c.id=d.student ",
      [userId]
    );
    if (records.rowCount > 0) return records.rows;
    return null;
  } catch (err) {
    return err;
  }
};

exports.create = async (classObj) => {
  try {
    const records = await pool.query(
      "insert into classroom(section,topic,room,name) values($1,$2,$3,$4)",
      [classObj.section, classObj.topic, classObj.room, classObj.name]
    );
    return records;
  } catch (err) {
    return err;
  }
};
