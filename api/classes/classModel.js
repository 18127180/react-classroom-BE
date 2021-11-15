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
      "select * from classroom c inner join (select a.class_id as student,b.class_id as teacher from (select class_id from class_student where student_id = $1) a full join (select class_id from class_teacher where teacher_id = $1 ) b on a.class_id=b.class_id) d on c.id=d.teacher or c.id=d.student ",
      [userId]
    );
    if (records.rowCount >= 0) return records.rows;
    return null;
  } catch (err) {
    return err;
  }
};

exports.getListStudentByClassId = async (class_id) => {
  try {
    const records = await pool.query(`select u.id,u.first_name ,u.last_name from class_student cs join "user" u on cs.student_id = u.id where cs.class_id = $1`
    ,[class_id]);
    return records.rows;
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

exports.joinClass = async (class_id, student_id) => {
  try {
    const records = await pool.query(
      `insert into class_student(class_id, student_id) values($1,$2) returning id`,
      [class_id, student_id]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.joinClassByTeacherRole = async (class_id, student_id) => {
  try {
    const records = await pool.query(
      "insert into class_teacher(class_id, teacher_id) values($1,$2) returning id",
      [class_id, student_id]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.checkExistStudentInClass = async (class_id, student_id) => {
  try {
    const records = await pool.query(
      "select * from class_student where class_id = $1 and student_id = $2",
      [class_id, student_id]
    );
    console.log(records.rowCount);
    return records.rowCount;
  } catch (error) {
    return null;
  }
};

exports.checkExistTeacherInClass = async (class_id, student_id) => {
  try {
    const records = await pool.query(
      "select * from class_teacher where class_id = $1 and teacher_id = $2",
      [class_id, student_id]
    );
    console.log(records.rowCount);
    return records.rowCount;
  } catch (error) {
    return null;
  }
};

exports.getUserDataByEmail = async (email) => {
  try {
    const records = await pool.query(
      'select * from "user" u where u.email = $1',
      [email]
    );
    return records.rows[0];
  } catch (error) {
    return null;
  }
};

exports.getClassDataByInviteCode = async (invite_code) => {
  try {
    const records = await pool.query(
      "select * from classroom c where c.invitecode = $1",
      [invite_code]
    );
    return records.rows[0];
  } catch (error) {
    return null;
  }
};

exports.getDataStudentsByClassId = async (class_id) => {
  try {
    const records = await pool.query(
      'select u.id, u.first_name, u.last_name, u.avatar,u.student_id from class_student cs join "user" u on cs.student_id = u.id where class_id = $1',
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
};

exports.getDataTeachersByClassId = async (class_id) => {
  try {
    const records = await pool.query(
      'select u.id, u.first_name, u.last_name, u.avatar from class_teacher cs join "user" u on cs.teacher_id = u.id where class_id = $1',
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
};

exports.removeStudentInClass = async (class_id, student_id) => {
  try{
    const records = await pool.query(
      `delete from class_student cs where cs.class_id = $1 and cs.student_id = $2`,
      [class_id,student_id]
    );
    return records;
  }catch (error){
    return error;
  }
}

