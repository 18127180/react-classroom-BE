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

exports.createClass = async (classObj) => {
  try {
    const records = await pool.query(
      "insert into classroom(name,section,topic,description,invitecode) values($1,$2,$3,$4,$5) returning *",
      [
        classObj.name,
        classObj.section,
        classObj.topic,
        classObj.description,
        classObj.invitecode,
      ]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.createTeacherForClass = async (teacher_id, class_id) => {
  try {
    const records = await pool.query(
      "insert into class_teacher(class_id, teacher_id) values($1,$2) returning id",
      [class_id, teacher_id]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getDetailClass = async (id) => {
  try {
    const records = await pool.query(
      "select * from classroom c where c.id=$1",
      [Number(id)]
    );
    return records.rows[0];
  } catch (err) {
    return err;
  }
};
