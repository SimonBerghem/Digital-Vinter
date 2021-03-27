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

    getAccidentWeather : async function(req, res, next, counties, fromDate, toDate){
	authorization.getConnection(function(err, conn){
	    if (err) throw err
	    let data = [];
	    let weatherdata = [];
	    let accidents = [];

	    // Fullösning för att async.each inte ska dela upp länsnummer
	    let the_county = [counties];
	    async.each(the_county, function(county, callback){
		//Hämta data från trafikolyckor inom län och tid
	        const sql = `Select SeverityCode, CreationTime, WGS84 From db.road_accident_data Where IconId = 'roadAccident' AND CountyNo = ${county} AND CreationTime between '${fromDate}' AND '${toDate}';`;
		conn.query(sql, function(err, results){
		    accidents = results
		    callback();
		    if (err) throw err
		});
	    }, function(callback){
	    	async.each(accidents, function(accident, callback2){
		    //Hämta väg-väderdata från den närmaste stationen till olyckan med tid närmast olyckans starttid
		    const sql = `SELECT air_humidity, road_temperature, station_id, timestamp FROM weather_data WHERE station_id = (SELECT id from db.station_data WHERE county_number = ${counties} ORDER BY power(abs( CAST(SUBSTRING(('${accident.WGS84}'),8,8) AS DECIMAL(9,6)) - CAST(SUBSTRING((WGS84),8,8) AS DECIMAL(9,6)))+abs(CAST(SUBSTRING_INDEX('${accident.WGS84}', ' ', -1) AS DECIMAL(9,6)) - CAST(SUBSTRING_INDEX(WGS84, ' ', -1) AS DECIMAL(9,6))),2) LIMIT 1) ORDER BY abs(TIMESTAMPDIFF(Minute, weather_data.timestamp, '${accident.CreationTime}')) LIMIT 1;`;
		    conn.query(sql, function(err, results){
			if (err) throw err
			var Severity = 0;
			if (accident["SeverityCode"] != ''){
			    Severity = parseInt(accident["SeverityCode"]);
			}
			try{
			results[0]["SeverityCode"] = Severity;
		    	weatherdata.push(results[0]);
		        callback2();
			} catch (err){
			    callback2();
			}
		    });
		}, function(callback2){
		    async.each(weatherdata, function(weather, callback3){
			var time = weather["timestamp"].toISOString();
			//Hämta medelvärden av väg-väderdata 24 timmar innan olyckan inträffade
			const sql =  `SELECT AVG(air_humidity), AVG(road_temperature) FROM weather_data WHERE station_id = '${weather["station_id"]}' and weather_data.timestamp < '${time}' AND weather_data.timestamp >= date_sub('${time}', INTERVAL 24 HOUR);`;
			conn.query(sql, function(err, results){
			    if (err) throw err
			    data.push(Object.assign({}, results[0], weather));
			    callback3();
			});
		    }, function(callback3){
	    	    	res.send(data);
	    	    	conn.release();
		    });
		});
	    });
	});
    },

    getAccidentWeatherStation : function(req, res, next, starttime, station_id){

	authorization.getConnection(function(err, conn){
	    if (err) throw err
	    let data = [];
	    async.each(station_id, function(station, callback){
	    	const sql = `SELECT air_humidity, road_temperature, station_id, timestamp FROM weather_data WHERE station_id = '${station_id}' ORDER BY abs(TIMESTAMPDIFF(Minute, weather_data.timestamp, '${starttime}')) LIMIT 1;`;
	    	conn.query(sql, function (err,  results){
		    data = results;
		    callback();
	 	    if (err) throw err
		});
	   }, function (callback){
		const sql = `SELECT AVG(air_humidity), AVG(road_temperature) FROM weather_data WHERE station_id = '${data[0]["station_id"]}' and weather_data.timestamp < '${data[0]["timestamp"].toISOString()}' AND weather_data.timestamp >= date_sub('${data[0]["timestamp"].toISOString()}', INTERVAL 24 HOUR);`;
		conn.query(sql, function(err, result){
		    data[0] = Object.assign({}, data[0], result[0]);
		    res.send(data);
		    conn.release();
		});
	   });
	});
    },
/*följande kod används för att öka infon tillgänglig på olyckspopup, dock problem nånstans i eller en annan funktion som används för att öka info
        getAccidentWeatherStationData(req, res, starttime, station_id){
	authorization.getConnection(function(err, conn){
		if (err) throw err
		let data = [];
		const sql = `SELECT precipitation_type, road_temperature, air_humidity from weather_data WHERE station_id = '${station_id}' ORDER BY abs(TIMESTAMPDIFF(Minute, weather_data.timestamp, '${starttime}')) LIMIT 1;`;
		console.log(sql);
		conn.query(sql, function(err, results){
			data = results;
			res.send(data);
			conn.release();
			if (err) throw err;
		});
	});
    },
    getAccidentStation(req, res, lon, lat, countyNum){
	authorization.getConnection(function(err, conn){
		if(err) throw err
		let data = [];
		const sql = `SELECT stationID from station_LonLat WHERE county_number = '${countyNum}' ORDER BY abs(power(abs(lon-'${lon}')+abs(lat-'${lat}'),2)) LIMIT 1;`;
		conn.query(sql, function(err, results){
			data = results;
			res.send(data);
			conn.release();
			if (err) throw err;
		});
	});
    },*/
    findClosestAccidents : function(req, res, next, station_id){

	authorization.getConnection(function(err, conn){
	    if (err) throw err
	    const sql = `SELECT SeverityCode, CreationTime FROM road_accident_data WHERE IconId = 'roadAccident' AND (SELECT station_data.id from db.station_data WHERE station_data.county_number = road_accident_data.CountyNo ORDER BY power(abs(CAST(SUBSTRING((road_accident_data.WGS84),8,8) AS DECIMAL(9,6)) - CAST(SUBSTRING((station_data.WGS84),8,8) AS DECIMAL(9,6)))+abs(CAST(SUBSTRING_INDEX(road_accident_data.WGS84, ' ', -1) AS DECIMAL(9,6))- CAST(SUBSTRING_INDEX(station_data.WGS84, ' ', -1) AS DECIMAL(9,6))),2) LIMIT 1) = '${station_id}';`;
	    conn.query(sql, function (err, results){
		res.send(results);
		conn.release();

		if (err) throw err
	    });
	});
    }
};


