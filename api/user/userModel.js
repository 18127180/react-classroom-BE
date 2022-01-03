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

exports.getUser = async (id) => {
  try {
    const records = await pool.query(`SELECT * FROM "user" WHERE id=$1`, [id]);
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    return err;
  }
};

exports.changePassword = async (id, hashPasword) => {
  await pool.query(`UPDATE "user" SET password=$2 WHERE id=$1`, [id, hashPasword]);
};

exports.getAdmins = async (pageSize, page, orderCreatedAt, search) => {
  console.log(orderCreatedAt);
  let tempSearch = null;
  if (search !== "") {
    tempSearch = `AND (first_name LIKE '%${search}%' OR last_name LIKE '%${search}%' OR email LIKE '%${search}%') `;
    console.log(tempSearch);
  }
  console.log(search + "-" + tempSearch);
  let sql =
    `SELECT id,first_name,last_name,email,avatar,role,status,"createdAt" FROM "user" WHERE role NOTNULL ` +
    (tempSearch !== null ? tempSearch : "") +
    ` ORDER BY "createdAt" ` +
    orderCreatedAt +
    ` LIMIT $1 OFFSET $2`;
  console.log(sql);
  const result = await pool.query(sql, [pageSize, (page - 1) * pageSize]);
  console.log(result);
  return result.rows;
};

exports.getAdminsCount = async () => {
  const result = await pool.query(`SELECT COUNT(id) AS count FROM "user" WHERE role NOTNULL`);
  return result.rows[0].count;
};

exports.createAdmin = async (obj) => {
  const result = await pool.query(
    `INSERT INTO "user" (first_name,last_name,email,password,role) VALUES($1,$2,$3,$4,$5)`,
    [obj.first_name, obj.last_name, obj.email, obj.password, obj.role]
  );
  return result;
};
