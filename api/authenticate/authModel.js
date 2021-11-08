
const pool = require("../../config-db");

exports.checkExistUser = async (userId) => {
    try {
        const records =  await pool.query('SELECT id FROM "user" WHERE id=$1',[userId]);
        return records.rows.length;
    } catch (error) {
        return error;
    }
}

exports.checkExistUserThirdParty = async (userId) => {
    try {
        const records =  await pool.query('SELECT id FROM "thirdparty_user" WHERE id_provider=$1',[userId]);
        return records.rows.length;
    } catch (error) {
        return error;
    }
}

exports.createThirdPartyUser = async (userObj) => {
    try{
        const records =  await pool.query('insert into "thirdparty_user" (first_name,last_name,email,name,avatar,id_provider) values($1,$2,$3,$4,$5,$6)',
        [userObj.first_name, userObj.last_name, userObj.email, userObj.name,userObj.avatar,userObj.id_provider]);
        return records;
    }catch(err){
        return err;
    }
}