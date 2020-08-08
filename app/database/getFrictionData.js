const authorization = require('./authorization').pool;
var async = require("async");



/* Functions in the DB class that is usable by other files */
module.exports = {

    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */


/**
 * SELECT CAST(ObservationTimeUTC as DATE) as time_measured, CAST(MeasureValue as Double) as friction , NumberOfMeasurements FROM friction_data a 
            WHERE (
                      acos(sin(a.latitude * 0.0175) * sin(57.55173111 * 0.0175) 
                           + cos(a.latitude * 0.0175) * cos(57.55173111 * 0.0175) *    
                             cos((12.05319023 * 0.0175) - (a.longitude * 0.0175))
                          ) * 6371 <= 2 AND ObservationTimeUTC IS NOT NULL
                  )ORDER BY ObservationTimeUTC ASC;
 */


    //Test Function, this should use aggregated data in the future.


    getStationFromName:function(req, res, next, station_name){

        authorization.getConnection(function(err, conn){
            if (err) throw err

            
            
            const sql =`SELECT lat, lon FROM db.station_data WHERE name = ?`;
            
            conn.query(sql, [station_name],function (err, results) {
                // send data back to client
                console.log(results)
                res.send(results);
                conn.release();

                if (err) throw err
            });
        });

    },

    getFrictionFromStation : function(req, res, next,lon, lat){



        authorization.getConnection(function(err, conn){
            if (err) throw err

            
            
            const sql =`SELECT CAST(ObservationTimeUTC as DATE) as time_measured, CAST(MeasureValue as Double) as friction , NumberOfMeasurements FROM friction_data a 
            WHERE (
                      acos(sin(a.latitude * 0.0175) * sin( ? * 0.0175) 
                           + cos(a.latitude * 0.0175) * cos( ? * 0.0175) *    
                             cos(( ? * 0.0175) - (a.longitude * 0.0175))
                          ) * 6371 <= 2 AND ObservationTimeUTC IS NOT NULL
                  )ORDER BY ObservationTimeUTC ASC;`

            ;
            var variablesql = [lat, lat ,lon];
            conn.query(sql,variablesql, function (err, results) {
                // send data back to client
                
                console.log(results)
                res.send(results);
                conn.release();

                if (err) throw err
            });
        });
    },


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
                res.send(results);
                conn.release();
                if (err) throw err
            });

        });
    },

    // GET AGGREGATED FRICTION DATA

    getAggregatedFrictionData : function(distance, timeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction){
       return new Promise((resolve, reject) => {
           authorization.getConnection(function(err, conn){
                if (err) throw err
                const { northEastLat, northEastLong, southWestLat, southWestLong } = mapBounds
                const sql =`
                    SELECT
                        id,
                        time,
                        timeAggregation,
                        distance,
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
                    WHERE distance = ? AND timeAggregation = ? AND time BETWEEN ? AND ? AND reporterOrganization = ? AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ? AND measureValueMin < ?
                    `
                conn.query(sql, [distance, timeAggregation, startTime, endTime, reporterOrganization, southWestLat, northEastLat, southWestLong, northEastLong, maxFriction], function (err, results) {
                    resolve(results);
                    conn.release();
                    if (err) throw reject(err)
                });
            })
        ;})
    },

    // FIND GOOD AGGREGATION
    autoAggregate : function (res, startTime, endTime, reporterOrganization, mapBounds, maxFriction){
        try{
            let promiseArray = new Array()
            // Query for raw data size
            promiseArray.push(this.getCountFriction(startTime, endTime, reporterOrganization, mapBounds, maxFriction))
            // Query for aggregation datasize
            const distance = [1, 10, 100]
            const timeAggregation  = [1, 24, 24*7, 24*7*4]
            distance.forEach(distance => {
                timeAggregation.forEach(timeAggregation => {
                    promiseArray.push(this.getCountAggregatedFriction(distance, timeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction))
                })
            })
            Promise.all(promiseArray).then(data => {
                let potentialQueries = new Array
                // Check if raw data can be displayed
                const rawData = data.filter(result => {
                    return result.distance === "No Aggregation"
                })
                if(rawData[0].results[0].size < 50000) {
                    this.getSpecificFrictionData(startTime, endTime, reporterOrganization, mapBounds, maxFriction).then(result => {
                        res.send({ distance:'No Aggregation', timeAggregation:'No Aggregation', result,  success: true, autoAggregation:true })
                    })
                } else {
                    data.forEach(query => {
                        if(query.results[0].size < 20000) {
                            potentialQueries.push(query)
                        }
                    })
                    // Test case for when no aggregation works on data
                    //potentialQueries = []
                    if(potentialQueries.length === 0) {
                        res.send({ success:false })
                    }
                    // Sort so that the query with the most elements but less < 30000 are on top.
                    potentialQueries.sort((a, b) => b.results[0].size - a.results[0].size)
                    const chosenDistance = potentialQueries[0].distance
                    const chosenTimeAggregation = potentialQueries[0].timeAggregation
                    this.getAggregatedFrictionData(chosenDistance, chosenTimeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction).then(result => {
                        res.send({ distance:chosenDistance, timeAggregation:chosenTimeAggregation, result, success:true, autoAggregation:true })
                    })
                }
            })
        } catch(error) {
            throw(error)
        }
    },

    // GET COUNT(*) OF ELEMENTS IN A AGGREGATED FRICTION TABLE

    getCountAggregatedFriction : function(distance, timeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction){
        return new Promise((resolve, reject) => {
            authorization.getConnection(function(err, conn){
                 if (err) throw err
                 const { northEastLat, northEastLong, southWestLat, southWestLong } = mapBounds
                 const sql =`
                     SELECT
                         COUNT(*) AS size
                     FROM aggregated_friction_data
                     WHERE distance = ? AND timeAggregation = ? AND time BETWEEN ? AND ? AND reporterOrganization = ? AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ? AND measureValueMin < ?
                     `
                 conn.query(sql, [distance, timeAggregation, startTime, endTime, reporterOrganization, southWestLat, northEastLat, southWestLong, northEastLong, maxFriction], function (err, results) {
                     resolve({ results, distance, timeAggregation });
                     conn.release();
                     if (err) throw reject(err)
                 });
             })
         ;})
     },
     
     // GET COUNT(*) OF ELEMENTS IN FRICTION TABLE
     getCountFriction : function(startTime, endTime, reporterOrganization, mapBounds, maxFriction){
        return new Promise((resolve, reject) => {
            authorization.getConnection(function(err, conn){
                 if (err) throw err
                 const { northEastLat, northEastLong, southWestLat, southWestLong } = mapBounds
                 const sql =`
                     SELECT
                         COUNT(*) AS size
                     FROM friction_data
                     WHERE observationTimeUTC BETWEEN ? AND ? AND reporterOrganization = ? AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ? AND measureValue < ?
                     `
                 conn.query(sql, [startTime.toString(), endTime.toString(), reporterOrganization.toString(), southWestLat, northEastLat, southWestLong, northEastLong, maxFriction], function (err, results) {
                     resolve({ results, distance:'No Aggregation', timeAggregation:'No Aggregation' });
                     conn.release();
                     if (err) throw reject(err)
                 });
             })
         ;})
     },
     // GET SPECIFIC FRICTION DATA
     getSpecificFrictionData : function(startTime, endTime, reporterOrganization, mapBounds, maxFriction){
        return new Promise((resolve, reject) => {
            authorization.getConnection(function(err, conn){
                 if (err) throw err
                 const { northEastLat, northEastLong, southWestLat, southWestLong } = mapBounds
                 const sql =`
                     SELECT
                         *
                     FROM friction_data
                     WHERE observationTimeUTC BETWEEN ? AND ? AND reporterOrganization = ? AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ? AND measureValue < ?
                     `
                 conn.query(sql, [startTime, endTime, reporterOrganization, southWestLat, northEastLat, southWestLong, northEastLong, maxFriction], function (err, results) {
                     resolve(results);
                     conn.release();
                     if (err) throw reject(err)
                 });
             })
         ;})
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
    },
    // Get friction data in a certain rectangle, probably used when drawing a rectangle on map
    getDataDateRange : function(req, res, next){
        return new Promise((resolve, reject) => {
            authorization.getConnection(function(err, conn){
                if (err) throw reject(err)
                
                const sql =`
                SELECT
                    DATE_ADD(MIN(Time), INTERVAL -1 DAY) AS startDate,
                    DATE_ADD(MAX(Time), INTERVAL 1 DAY) AS endDate
                FROM db.aggregated_friction_data`
                
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
