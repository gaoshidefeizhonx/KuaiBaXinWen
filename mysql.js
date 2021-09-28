const mysql = require("mysql")
module.exports = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "userdb",
})

