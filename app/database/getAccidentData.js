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
    getAccidentWeather : function(req, res, next, accident_id){
        authorization.getConnection(function(err, conn){
            if (err) throw err
            
            let accident_data = [];
            getCreationTime(accident_id);

            let station_id = [];
            findClosestStation(accident_id);

            let accident_weather = [];

            const sql = "SELECT road_accident_data.SeverityCode, weather_data.id, weather_data.timestamp, road_accident_data.CreationTime FROM road_accident_data inner join weather_data ON road_accident_data.CountyNo = (select station_data.county_number from station_data where station_data.id = weather_data.station_id) and weather_data.station_id = ${station_id[0]} and weather_data.timestamp LIKE CONCAT('%', SUBSTRING_INDEX(${creationTime[0]},':',2) ,'%');";
            console.log(sql)
            // do a async loop through the station_id list
            async.each(station_id, function(id, callback){

                // get latest row of station weather data

                conn.query(sql, function (err, results) {
                
                    // convert timestamp and windspeed to wanted units
                    convertData(results)
                    
                    accident_weather.push(results);
                    callback();
                    
                })
            
            },function(callback){
                // when async functions are done send data back
                res.send(accident_data);
                conn.release();

                if (err) throw err
                
            });
        });
        
    }

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

function getCreationTime(accident_id){
    connection.query("SELECT CreationTime, WGS84 FROM road_accident_data WHERE road_accident_data = ${accident_id}", function(err, accident_data){
        if(err) {
          throw err;
        } else {
          setAccidentValue(accident_data);
        }
      });
}

function setAccidentValue(value){
    accident_data = value;
}

function findClosestStation(accident_data){

    var lon = parseFloat(accident_data[1].split(" ")[1].split("(")[1]);
    var lat = parseFloat(accident_data[1].split(" ")[2].split(")")[0]);

    connection.query("SELECT id, county_number from db.station_data ORDER BY power(abs(${lon}-CAST(SUBSTRING((WGS84),8,8) AS DECIMAL(9,6)))+abs(${lat}-CAST(SUBSTRING_INDEX(WGS84, ' ', -1) AS DECIMAL(9,6))),2) LIMIT 1;", function(err, creationTime){
        if(err) {
          throw err;
        } else {
          setCreationValue(creationTime);
        }
      });
}

function setStationValue(value){
    station_id = value;
}
