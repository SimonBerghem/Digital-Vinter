const authorization = require('./authorization').pool;
var async = require("async");


/* Functions in the DB class that is usable by other files */
module.exports = {
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */ 


    // Check connection to MySQL 
    getLatestAverageTempProvince : function(req, res, next){
       
        authorization.getConnection(function(err, conn){
            if (err) throw err
            
            // select avg temps from stations in county over the last 15 min
            var old_broken_sql =  "SELECT * FROM (\
                            SELECT * FROM (\
                                SELECT w.id, w.air_temperature, w.road_temperature, s.county_number FROM weather_data w, station_data s \
                                WHERE w.station_id = s.id) \
                            AS g ORDER BY g.id DESC LIMIT 550) \
                        AS t ORDER BY t.county_number ASC";
                    

            var sql_oldversion = `select * from 
                                (select g.id, g.station_id, g.air_temperature, g.road_temperature, t.county_number from 
                                    (SELECT w.id,w.station_id, w.air_temperature, w.road_temperature FROM weather_data w order by w.id desc LIMIT 550) 
                                    as g inner join 
                                    (select s.id, s.county_number from station_data s) 
                                as t on g.station_id = t.id) 
                            as h order by h.county_number asc`;

            //This query kinda works
            var sql = `select t.station_id, t.id, t.road_temperature, t.air_temperature, station_data.county_number 
            from weather_data t
            inner join(
                select station_id, max(id) as MaxID
                from weather_data
                group by station_id    
            ) tm on t.station_id = tm.station_id and t.id = tm.MaxID
            inner join
            station_data on t.station_id = station_data.id order by station_data.county_number asc`;

            conn.query(sql, function (err, results) {
            
                
                let temperatures = [];
                
                // smalest county number is 2
                var county = 0;

                // highest county number is 25, loop up to that
                while(county < 26){
                    let temporary_air_temp= 0;
                    let temporary_road_temp= 0;

                    let stations_per_county = 0;

                    // loop through the given values and for every element that lies in a specific county
                    for(var i = 0; i < results.length; i++){
                        if(results[i].county_number == county){
                            // add the temperature of the station in the county and count up 1
                            temporary_air_temp += results[i].air_temperature;
                            temporary_road_temp += results[i].road_temperature;

                            stations_per_county++;
                        }
                        
                    }
                    // if there is any stations in a county, add the calculated avg to the list
                   
                    temperatures.push([county,temporary_air_temp/stations_per_county, temporary_road_temp/stations_per_county]);

                    

                    county++;

                    
                }

                // send data back to client
                res.send(temperatures);
                conn.release();
                if (err) throw err

            });
        });
    }, 
    
    getAverageTempProvince: function(req, res, next, provinces, start_time, stop_time){

        authorization.getConnection(function(err, conn){
            if (err) throw err
        

            
            // var sql = "SELECT * FROM weather_data WHERE station_id = ? AND timestamp BETWEEN ? AND ?";
            // "select w.air_temperature, s.county_number from weather_data as w, station_data as s where w.station_id = s.id and s.county_number = 25;"
            // "select w.air_temperature, w.timestamp from weather_data as w where w.station_id in (select s.id from station_data as s where county_number = 25);"

           // var sql = "select w.air_temperature, w.timestamp, w.road_temperature, w.air_humidity,w.wind_speed from weather_data as w where w.station_id in (select s.id from station_data as s where county_number = ?) and w.timestamp between ? and ? order by w.timestamp asc";

            var sql = `select w.air_temperature, w.timestamp from weather_data as w where w.station_id in 
                        (select s.id from station_data as s where county_number = ?) 
                        and w.timestamp between ? and ? order by w.timestamp asc`;

            
            let weather_data = [];

            // do a async loop through the station_id list
            async.each(provinces, function(province, callback){
                

                let values = [province, start_time, stop_time]

                conn.query(sql,values, function (err, results) {
                    if(results.length <= 0){
                        return;
                    }
                    let filtered_result = [];
                    
                    // calculate the time difference between the first and last result
                    let time_diff = results[results.length - 1].timestamp.getTime() - results[0].timestamp.getTime();

                    //change time_diff from ms to h
                    time_diff = time_diff / (3.6*(10**6));
                    
                    let i = 0;
                    
                    let avg_air_temp = 0;
                    let avg_road_temp = 0;
                    let avg_wind_speed = 0;
                    let avg_air_humid = 0;
                    let count = 0;

                    let calculated_avg = [];

                    for(let n = 0; n < results.length; n++){

                        avg_air_temp += results[n].air_temperature;
                        avg_road_temp += results[n].road_temperature;
                        avg_wind_speed += results[n].wind_speed;
                        avg_air_humid += results[n].air_humidity;

                        count++;

                       
                        if(n >= results.length-1){
                            calculated_avg.push({air_temperature: avg_air_temp/count, 
                                                timestamp: results[n].timestamp,
                                                road_temperature: avg_road_temp/count,
                                                wind_speed: avg_wind_speed/count,
                                                air_humidity: avg_air_humid/count});

                            count = 0;
                            avg_air_temp = 0;
                            avg_road_temp = 0;
                            avg_wind_speed = 0;
                            avg_air_humid = 0;

                        }else if(results[n].timestamp.getTime() !== results[n+1].timestamp.getTime()){
                            calculated_avg.push({air_temperature: avg_air_temp/count, 
                                                timestamp: results[n].timestamp,
                                                road_temperature: avg_road_temp/count,
                                                wind_speed: avg_wind_speed/count,
                                                air_humidity: avg_air_humid/count});

                            count = 0;
                            avg_air_temp = 0;
                            avg_road_temp = 0;
                            avg_wind_speed = 0;
                            avg_air_humid = 0;
                        }

                    }

                    calculated_avg.forEach (result =>{
                        
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

                    callback();
                        
                })

                
            },function(callback){
                // when async functions are done send data back
                res.send(weather_data);
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

