const pool = require("../../config-db");

exports.create = async (userObj) => {
    try{
        const records =  await pool.query('insert into "user" (first_name,last_name,password,email) values($1,$2,$3,$4)',[userObj.first_name, userObj.last_name, userObj.password, userObj.email]);
        return records;
    }catch(err){
        return err;
    }
}