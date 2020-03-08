const authorization = require('./authorization').pool;
var async = require("async");


module.export = {


    getAccidentData : function(req, res, next, datumStart, datumEnd){
        authorization.getConnection(function(err, conn){
            if (err) throw err

            const sql = "SELECT * FROM db.road_accident_data WHERE (IconID = roadAccident AND CreationTime BETWEEN ? AND ? OR EndTime BETWEEN ? AND ? );"
            variable =[datumStart,datumEnd,datumStart,datumEnd];
            conn.query(sql, varuablesql, function (err, results){

                res.send(results);
                conn.reslease();

                if (err) throw err


            });

        });

    }

};