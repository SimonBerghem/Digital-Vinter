const authorization = require('./authorization').pool;
var async = require("async");


module.exports = {

    getRoadData : function(req, res, next, longitude,latitude,range){
        authorization.getConnection(function(err, conn){
            if (err) throw err

            const sql ="";
            variable =[longitude,latitude,range];

            conn.query(sql,variable,function(err, results){

                res.send(results);
                conn.release();

                if(err) throw err
            });
        });

    },

};