const authorization = require('./authorization').pool;
var async = require("async");



/* Functions in the DB class that is usable by other files */
module.exports = {
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */


    // GET FRICTION DATA
    getFrictionData : function(req, res, next, reporter){
       
        // ssh to database server and then connect to db
        // mysqlssh.connect(auth.ssh, auth.database).then(client => {
        
        authorization.getConnection(function(err, conn){
            if (err) throw err

            const sql =`
                SELECT
                    t.id,
                    t.ObservationTimeUTC,
                    t.ReportTimeUTC,
                    t.Longitude,
                    t.Latitude,
                    t.AreaCode,
                    t.NumberOfMeasurements,
                    t.MeasureValue,
                    t.MeasureConfidence,
                    t.ReporterOrganization
                FROM friction_data t
                INNER JOIN(
                    SELECT
                        latitude,
                        longitude,
                        max(id) as MaxID
                    FROM friction_data
                    WHERE reporterOrganization = ?
                    GROUP BY latitude, longitude
                ) tm ON t.latitude = tm.latitude and t.longitude = tm.longitude and t.id = tm.MaxID;`
            conn.query(sql, [reporter], function (err, results) {
                console.log(results.length)
                res.send(results);
                conn.release();
                if (err) throw err
            });

        });
    },

    // GET AGGREGATED FRICTION DATA

    getAggregatedFrictionData : function(req, res, next, radius, timeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction){
       
        // ssh to database server and then connect to db
        // mysqlssh.connect(auth.ssh, auth.database).then(client => {
        
        authorization.getConnection(function(err, conn){
            if (err) throw err
            const { northEastLat, northEastLong, southWestLat, southWestLong } = mapBounds
            const sql =`
                SELECT
                    id,
                    time,
                    timeAggregation,
                    radius,
                    reporterOrganization,
                    longitude,
                    latitude,
                    numberOfMeasurements,
                    measureValueMedian,
                    measureValueMax,
                    measureValueMin,
                    measureConfidenceMedian,
                    measureConfidenceMax,
                    measureConfidenceMin,
                    nrOfAddedPoints
                FROM aggregated_friction_data
                WHERE radius = ? AND timeAggregation = ? AND time BETWEEN ? AND ? AND reporterOrganization = ? AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ? AND measureValueMin < ?
                `
            conn.query(sql, [radius, timeAggregation, startTime, endTime, reporterOrganization, southWestLat, northEastLat, southWestLong, northEastLong, maxFriction], function (err, results) {
                console.log(results.length)
                if(results.length > 20000) {
                    res.send([])
                    conn.release();
                } else {
                
                res.send(results);
                conn.release();
                }
                if (err) throw err
            });

        });
    },

    // GET REPORTER ORGANIZATIONS
    getDistinctReporterorgFriction : function(req, res, next){
            
        authorization.getConnection(function(err, conn){
            if (err) throw err
            
            const sql =`SELECT DISTINCT reporterorganization FROM reporter_organizations;`

            
            conn.query(sql, function (err, results) {
                // if there is no resluts return
                if(results == null){
                    return;
                }
                // If no data try to query friction_data to get reporterOrganistaions
                if(results.length == 0) {
                    const sql =`SELECT DISTINCT reporterorganization FROM friction_data;`
                    conn.query(sql, function (err, results) {
                        // If we have reporterOrganizations update table reporter_organizations with new data
                        if(results.length > 0) {
                            let reporterOrganizations = []
                            results.forEach(result => {
                                reporterOrganizations.push([result.reporterorganization])
                            })

                            const sqlInsert = `
                                INSERT IGNORE INTO reporter_organizations
                                VALUES ?;
                            `
                            conn.query(sqlInsert, [reporterOrganizations], (err, response) => {
                                if(err) {
                                    throw err
                                }
                            })
                        }
                        res.send(results)
                        conn.release()
                    })
                } else {
                    res.send(results);
                    conn.release();
                }
                if (err) throw err
     
            });

        });
    },
    // GET ALL FRICTION DATA
    getAllFrictionData : function(req, res, next){
            
        authorization.getConnection(function(err, conn){
            if (err) throw err
            
            const sql =`SEELCT * FROM friction_data;`

            
            conn.query(sql, function (err, results) {
                // send data back to client
                res.send(results);
                conn.release();
                if (err) throw err
     
            });

        });
    },

     // Get friction data in a certain rectangle, probably used when drawing a rectangle on map
     getFrictionDataRect : function(req, res, next, reporter, SWlat, NElat, SWlon, NElon){
        
        authorization.getConnection(function(err, conn){
            if (err) throw err
            
            const sql =`
                SELECT * 
                FROM friction_data 
                WHERE reporterOrganization = ? AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?;`
            var values = [reporter, SWlat, NElat, SWlon, NElon];
            
            conn.query(sql, values, function (err, results) {
                // send data back to client
                res.send(results);
                conn.release();

                if (err) throw err
            });
        });



    },

     // Get friction data in a certain circle, probably used when drawing a circle on map
     getFrictionDataCirc : function(req, res, next, reporter, lat, lon, radius){
       

        authorization.getConnection(function(err, conn){
            if (err) throw err
            
            const sql =`SELECT * FROM friction_data a 
            WHERE (
                      acos(sin(a.latitude * 0.0175) * sin(? * 0.0175) 
                           + cos(a.latitude * 0.0175) * cos(? * 0.0175) *    
                             cos((? * 0.0175) - (a.longitude * 0.0175))
                          ) * 6371 <= ?
                  ) and ReporterOrganization = ?;`

            var variablesql = [lat,lat,lon,(radius/1000),reporter];
            conn.query(sql, variablesql, function (err, results) {
                // send data back to client
                res.send(results);
                conn.release();

                if (err) throw err



            });
        });
    },

    getLatestFrictionData : function(req, res, next, friction_id){
        

           authorization.getConnection(function(err, conn){
            if (err) throw err
             
            let friction_data = [];
    
            const sql = "SELECT * FROM friction_data WHERE id = ?";

            // do a async loop through the station_id list
            async.each(friction_id, function(id, callback){

                // get latest row of station weather data
                const values =  [[id]];

                conn.query(sql, [values], function (err, results) {
                    
                    // convert timestamp and windspeed to wanted units
                    
                    friction_data.push(results);
                    callback();
                    
                })
            
            },function(callback){
                // when async functions are done send data back
                res.send(friction_data);
                conn.release();

                if (err) throw err

            });
         });
    }

};
