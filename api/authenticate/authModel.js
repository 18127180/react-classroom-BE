
const pool = require("../../config-db");

exports.checkExistUser = async (userId) => {
    try {
        const records =  await pool.query('SELECT id FROM "user" WHERE id=$1',[userId]);
        return records.rows.length;
    } catch (error) {
        return error;
    }
}