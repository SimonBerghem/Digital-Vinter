const authorization = require('./authorization').pool;
var async = require("async");

/* Functions in the DB class that is usable by other files */
module.exports = {
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */

    // get latest inserted weather from given station
    getLatestWeatherData : function(req, res, next, station_id){
        

       
        authorization.getConnection(function(err, conn){
            if (err) throw err
            
            let weather_data = [];

            const sql = "SELECT * FROM weather_data WHERE station_id = ? ORDER BY id DESC LIMIT 1";

            // do a async loop through the station_id list
            async.each(station_id, function(id, callback){

                // get latest row of station weather data
                const values =  [[id]];

                conn.query(sql, [values], function (err, results) {
                    
                    // convert timestamp and windspeed to wanted units
                    convertData(results[0])
                    
                    weather_data.push(results);
                    callback();
                    
                })
            
            },function(callback){
                // when async functions are done send data back
                res.send(weather_data);
                conn.release();

                if (err) throw err
                
                

            });
        });
        
    },
    
    getAllLatestWeatherData : function(req, res, next){ //(req, res, next, length)

        
        authorization.getConnection(function(err, conn){
            if (err) throw err

            const sql_old = "SELECT * FROM weather_data ORDER BY id DESC LIMIT ?";

            const sql = `select t.station_id, t.id, t.timestamp, t.road_temperature, t.air_temperature, t.precipitation_type, t.precipitation_millimetres, t.air_humidity, t.wind_speed, t.wind_direction
            from weather_data t
            inner join(
                select station_id, max(id) as MaxID
                from weather_data
                group by station_id    
            ) tm on t.station_id = tm.station_id and t.id = tm.MaxID`
            
            conn.query(sql, function (err, results) { //   client.query(sql, [[parseInt(length)]], function (err, results) {
                
                // convert timestamp and windspeed to wanted units
                results.forEach(result => {
                    convertData(result)

                });
                res.send(results);
                conn.release();

                if (err) throw err

            });
        });
        
    },
    // get weather data from given station
    getWeatherData : function(req, res, next, station_id, start_time, stop_time){
       
        
        authorization.getConnection(function(err, conn){
            if (err) throw err           
            
            // get weather data between to given timestamps
            var sql = "SELECT * FROM weather_data WHERE station_id = ? AND timestamp BETWEEN ? AND ?";
            
            let weather_data = [];

            // do a async loop through the station_id list
            async.each(station_id, function(id, callback){

                var values =  [id,start_time, stop_time];

                conn.query(sql, values, function (err, results) {
                    if(results.length <= 0){
                        console.log("Error");
                        return;
                    }
                    console.log("Test");
                    console.log(results);
                    let flag = true;
                    results.forEach (zeroPoint =>{
                        console.log(zeroPoint, "TestforEach")
                        if(zeroPoint.length <= 0){
                            console.log("Testif");
                            flag = true;
                        }
                    });
                    if(flag === true){
                        console.log("Test2");
                       req.flash('success', 'There is no data for a selected date')
                    }

                    let filtered_result = [];
                    // calculate the time difference between the first and last result
                    let time_diff = results[results.length - 1].timestamp.getTime() - results[0].timestamp.getTime();

                    //change time_diff from ms to h
                    time_diff = time_diff / (3.6*(10**6));
                    
                    console.log(results);

                    let i = 0;
                    
                    results.forEach (result =>{
                        
                        // convert timestamp and windspeed to wanted units
                        convertData(result);

                        // depeding on the time_diff, filter the result and add 1/1, 1/2, 1/4, 1/8 or 1/16 of every result
                        if(i % calculateFilter(time_diff) == 0){
                            filtered_result.push(result);
                        }

                        i++;
                    });

                    // add the data of the station to the list 
                    weather_data.push(filtered_result);

                    // callback to make the async stuff work
                    callback();
                    
                })

                
            },function(callback){
                // when async functions are done send data back
                res.send(weather_data);
                conn.release();

                if (err) throw err
            });
        });  
    },
    // get avarage weather data from given station
    getAverageWeatherData : function(req, res, next, station_id, start_time, stop_time){
        
        
        authorization.getConnection(function(err, conn){
            if (err) throw err           
            
            
            // get weather data between to given timestamps
            var sql = "SELECT AVG(road_temperature),AVG(air_temperature), AVG(air_humidity), AVG(wind_speed) \
                       FROM weather_data WHERE station_id = ? AND timestamp BETWEEN ? AND ?";
            var values =  [station_id,start_time, stop_time];
            
            conn.query(sql, values, function (err, results) {

                
                
                // send data back to client
                res.send(results);
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

