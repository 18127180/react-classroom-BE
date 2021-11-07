// const pgp = require('pg-promise')();

// const db = pgp("postgres://postgres:123123@localhost:5432/ex_week_04");
// db.query('SELECT topic AS value FROM classroom')
//     .then(function (data) {
//         return data;
//     })
//     .catch(function (error) {
//         return error;
//     })

const pool = require("../../config-db");

exports.list = async() => {
    try{
        const records =  await pool.query('SELECT * FROM classroom');
        return records.rows;
    }catch(err){
        return err;
    }
}

exports.create = async (classObj) => {
    try{
        const records =  await pool.query('insert into classroom(section,topic,room,name) values($1,$2,$3,$4)',[classObj.section, classObj.topic, classObj.room, classObj.name]);
        return records;
    }catch(err){
        return err;
    }
}
