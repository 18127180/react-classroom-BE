const Pool = require("pg").Pool;

const pool =  new Pool({
    user: "itpmgspswqzicz",
    password: "5d5c7c95063a21818a83497e11bd8f7a435876acf31d599ed0a3db7323e9f2af",
    database: "d7onrfl0qpifve",
    host: "ec2-35-171-41-147.compute-1.amazonaws.com",
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;