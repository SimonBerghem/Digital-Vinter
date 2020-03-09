const authorization = require('./authorization').pool;
var async = require("async");



/* Functions in the DB class that is usable by other files */
module.exports = {
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */
    
    getAccidentData  : function(req, res, next, datumStart, datumEnd) {
        console.log("HALLÅ")
        authorization.getConnection(function(err, conn){
            if (err) throw err
            console.log(datumStart)
            console.log(datumEnd)

            const sql = "SELECT * FROM db.road_accident_data WHERE (IconID = 'roadAccident' AND CreationTime BETWEEN ? AND ? OR EndTime BETWEEN ? AND ? );"
            variable =[datumStart,datumEnd,datumStart,datumEnd];
            conn.query(sql, variable, function (err, results){

                res.send(results);
                conn.release();

                if (err) throw err


            });

        });

    }

};
