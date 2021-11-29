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
    const records = await pool.query(
      `select u.id,u.first_name ,u.last_name from class_student cs join "user" u on cs.student_id = u.id where cs.class_id = $1`,
      [class_id]
    );
    return records.rows;
  } catch (err) {
    return err;
  }
};

exports.createClass = async (classObj) => {
  try {
    const records = await pool.query(
      "insert into classroom(name,section,topic,description,invitecode) values($1,$2,$3,$4,$5) returning *",
      [classObj.name, classObj.section, classObj.topic, classObj.description, classObj.invitecode]
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
    const records = await pool.query("select * from classroom c where c.id=$1", [Number(id)]);
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
    const records = await pool.query('select * from "user" u where u.email = $1', [email]);
    return records.rows[0];
  } catch (error) {
    return null;
  }
};

exports.getClassDataByInviteCode = async (invite_code) => {
  try {
    const records = await pool.query("select * from classroom c where c.invitecode = $1", [
      invite_code,
    ]);
    return records.rows[0];
  } catch (error) {
    return null;
  }
};

exports.getClassDataById = async (class_id) => {
  try {
    const records = await pool.query("select * from classroom c where c.id = $1", [class_id]);
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
  try {
    const records = await pool.query(
      `delete from class_student cs where cs.class_id = $1 and cs.student_id = $2`,
      [class_id, student_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.addQueueUser = async (email, role, class_id) => {
  try {
    const records = await pool.query(
      `insert into invite_queue(email,role,class_id) values($1,$2,$3)`,
      [email, role, class_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.removeQueueUser = async (email, role, class_id) => {
  try {
    const records = await pool.query(
      `delete from invite_queue where email = $1 and role = $2 and class_id = $3`,
      [email, role, class_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.checkQueueUser = async (email, class_id, role) => {
  try {
    const records = await pool.query(
      `select * from invite_queue where email = $1 and class_id = $2 and role = $3`,
      [email, class_id, role]
    );
    return records.rowCount;
  } catch (error) {
    return null;
  }
};

exports.listAssignment = async (user, classId) => {
  try {
    const record = await pool.query(
      'SELECT * FROM assignment WHERE class_id=$1 ORDER BY "order" ASC',
      [classId]
    );
    return [record.rowCount, record.rows];
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.deleteAssignment = async (user, body) => {
  try {
    const record = await pool.query(
      "DELETE FROM assignment WHERE id=$1 AND class_id=$2 AND teacher_id=$3 RETURNING *",
      [body.assignmentId, body.classId, user.id]
    );
    return [record.rowCount, record.rows];
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.addAssignment = async (user, body) => {
  try {
    const record = await pool.query(
      "SELECT 1 FROM class_teacher WHERE class_id=$1 AND teacher_id=$2",
      [body.classId, user.id]
    );
    if (record.rowCount !== 0) {
      const record2 = await pool.query(
        `INSERT INTO assignment(class_id,teacher_id,title,description,point,"order") VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
        [body.classId, user.id, body.title, body.description, body.point, body.count + 1]
      );
      if (record2.rowCount !== 0) return record2.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.updateAssignment = async (user, body) => {
  try {
    const record = await pool.query(
      "SELECT 1 FROM class_teacher WHERE class_id=$1 AND teacher_id=$2",
      [body.classId, user.id]
    );
    if (record.rowCount !== 0) {
      const record2 = await pool.query(
        "UPDATE assignment SET title=$1,description=$2,point=$3 WHERE id=$4 RETURNING *",
        [body.title, body.description, body.point, body.assignmentId]
      );
      if (record2.rowCount !== 0) return record2.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.updateAssignmentOrder = async (user, body) => {
  try {
    const record = await pool.query(
      "SELECT 1 FROM class_teacher WHERE class_id=$1 AND teacher_id=$2",
      [body.classId, user.id]
    );
    if (record.rowCount !== 0) {
      let sql = `UPDATE assignment SET "order" = CASE id `;
      body.newOrder.forEach((element) => {
        sql += `WHEN ${element.id} THEN ${element.order} `;
      });
      sql += `ELSE 0 END WHERE id IN (${body.newOrder.map((item) => item.id)}) RETURNING *`;
      console.log(sql);
      const record2 = await pool.query(sql);
      if (record2.rowCount !== 0) return record2.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.getGradeStructure = async (class_id) => {
  try {
    const records = await pool.query(
      "select * from grade_structure where class_id = $1",
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.getSyllabus = async (grade_structure_id) => {
  try {
    const records = await pool.query(
      `select * from syllabus s where grade_structure_id = $1 order by s."order" ASC`,
      [grade_structure_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.removeGradeStructure = async (class_id) => {
  try {
    const records = await pool.query(
      `delete from grade_structure gs where gs.class_id = $1`,
      [class_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.removeSyllabus = async (grade_structure_id) => {
  try {
    const records = await pool.query(
      `delete from syllabus s where s.grade_structure_id = $1`,
      [grade_structure_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.addGradeStructure = async (object) =>{
  try {
    const records = await pool.query(
      "insert into grade_structure(class_id,topic,description) values($1,$2,$3) returning *",
      [object.class_id,object.topic,object.description]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.addSyllabus = async (object) =>{
  try {
    const records = await pool.query(
      `insert into syllabus(grade_structure_id,subject_name,grade,"order") values($1,$2,$3,$4) returning *`,
      [object.grade_structure_id,object.subject_name,object.grade,object.order]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.getGradeTable = async (class_id,grade_structure_id) => {
  try {
    const records = await pool.query(
      `select s1.*, s.grade as max_score, s."order" from 
      syllabus s
      join (select ss.*,s2.student_id as exist_code 
      from student_syllabus ss left join 
      (select u.student_id 
      from "user" u 
      join class_student cs on u.id = cs.student_id 
      where cs.class_id = $1) as s2 on s2.student_id = ss.student_code) as s1
      on s.id = s1.syllabus_id
      where s.grade_structure_id = $2
      order by s."order" ASC`,
      [class_id,grade_structure_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}