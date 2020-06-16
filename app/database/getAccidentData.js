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
        authorization.getConnection(function(err, conn){
            if (err) throw err

            const sql = "SELECT * FROM db.road_accident_data WHERE (IconID = 'roadAccident' AND CreationTime BETWEEN ? AND ? OR EndTime BETWEEN ? AND ? );"
            variable =[datumStart,datumEnd,datumStart,datumEnd];
            conn.query(sql, variable, function (err, results){

                res.send(results);
                conn.release();

                if (err) throw err
            });
        });
    },
    // Get friction data in a certain rectangle, probably used when drawing a rectangle on map
    getDataDateRange : function(req, res, next){
        return new Promise((resolve, reject) => {
            authorization.getConnection(function(err, conn){
                if (err) throw reject(err)
                
                const sql =`
                SELECT
                    DATE_ADD(MIN(CreationTime), INTERVAL -1 DAY) AS startDate,
                    DATE_ADD(MAX(EndTime), INTERVAL 1 DAY) AS endDate
                FROM db.road_accident_data`
                
                conn.query(sql, function (err, results) {
                    // send data back to client
                    resolve(results);
                    conn.release();

                    if (err) throw reject(err)
                });
            });
        })
    },
};
