const authorization = require('./authorization').pool;
var async = require("async");

/* Functions in the DB class that is usable by other files */
module.exports = {
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */
   getClosestAccidentData : function(req, res, next, accident_id){
        

       
        authorization.getConnection(function(err, conn){
            if (err) throw err
            
            let creationTime = [];
            getCreationTime();

            let accident_data = [];

            const sql = "SELECT road_accident_data.SeverityCode, weather_data.id, weather_data.timestamp, road_accident_data.CreationTime FROM road_accident_data inner join weather_data ON road_accident_data.CountyNo = (select station_data.county_number from station_data where station_data.id = weather_data.station_id) and weather_data.station_id = ${station_id} and weather_data.timestamp LIKE CONCAT('%', SUBSTRING_INDEX(${creationTime[0]},':',2) ,'%');";
            console.log(sql)
            // do a async loop through the station_id list
            async.each(station_id, function(id, callback){

                // get latest row of station weather data

                conn.query(sql, function (err, results) {
                
                    // convert timestamp and windspeed to wanted units
                    convertData(results)
                    
                    accident_data.push(results);
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
};

   function calculateFilter(hours){
    // these limits are up for tweaking
    if(hours < 96){ // less then 4 days
        return 1;                        
    }else if(hours < 252){   // less then 1.5 week
        return 2;
    }else if(hours < 1008){   // less then 6 weeks
        return 4;
    }else if(hours < 2016){  // less then 12 weeks
        return 8;
    }else{
        return 16;
    }
}

function convertData(result){
    // convert fetched timestamp to correct timezone. 
    // JSON parses timestamp to UTC+0 and we live in UTC+1
    let current_time = result.timestamp;

    current_time.setHours(current_time.getHours() - current_time.getTimezoneOffset() / 60);
    
    // change windspeed from km/h to m/s and use 2 decimals
    result.wind_speed /=  3.6;
    result.wind_speed = result.wind_speed.toFixed(2);
}

function getCreationTime(accident_id){
    connection.query("SELECT CreationTime FROM road_accident_data", function(err, creationTime){
        if(err) {
          throw err;
        } else {
          setCreationValue(creationTime);
        }
      });
}

function setCreationValue(value){
    creationTime = value;
}