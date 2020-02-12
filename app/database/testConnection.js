const authorization = require('./authorization').pool;




/* Functions in the DB class that is usable by other files */
module.exports = {
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */


    // Check connection to MySQL 
    testConnection : function(req, res, next){        
     
        authorization.getConnection(function(err, conn){
            if (err) throw err

            conn.query('SELECT COUNT(*) FROM `weather_data`', function (err, results, fields) {
                console.log(results);
                conn.release();
                if (err) throw err
            });

        });
       
    }
}

