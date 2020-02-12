const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 100, 
    host     : 'localhost',
    database : 'db',
    user     : 'mysql',
    password : 'password'
});



exports.pool = pool;

/* function uploadBook(ID) {
    let query2 = "INSERT INTO `db`.`Books` (`idBooks`, `author`) VALUES ('?', 'JRR Tolkien');";
    let query = mysql.format(query2, [ID]);
    // query = DELETE from `todo` where `user`='shahid';
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows deleted
        console.log(response.affectedRows);
    });
};

upploadBook(28);
 */
