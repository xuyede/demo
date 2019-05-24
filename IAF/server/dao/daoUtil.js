const mysql = require('mysql');

// mysql链接生成
const createConnection = () =>
    mysql.createConnection( {
        host : '120.78.4.92',
        port : '3306',
        user : 'girst',
        password : '2VacdLophB91wenm',
        database : 'Finance'
    });

module.exports.createConnection = createConnection;