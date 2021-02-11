const authorization = require('./authorization').pool;
var async = require("async");

module.exports = {
getAccidentId : function(countyNo, fromDate, toDate){

        authorization.getConnection(function(err, conn){
            if (err) throw err
            // get all id
            const sql = `Select Id From db.road_accident_data Where CountyNo = ${countyNo} and CreationTime between '${fromDate}' AND '${toDate}'`;
            conn.query(sql, function (err, results) {
                // send data back to client



		console.log(results);
		console.log(typeof results);
		console.log(Object.values(results[0]));
                conn.release();

                if (err) throw err

            });
        });
    }

};







//test
module.exports.getAccidentId("1","2019-01-20 13:12:12","2021-02-11 11:51:08");


