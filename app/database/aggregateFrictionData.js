const fs = require('fs')
const authorization = require('./authorization').pool;
const { performance } = require('perf_hooks');

/* Functions in the DB class that is usable by other files */
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */

module.exports = {

  /* Parses and uploads friction data to database. Contains a couple of constants which might be worth experimenting with if server is running bad. "delay" and "nrOfChunks"
  * @param file
  */
  aggregateFrictionData: async function (startDate, endDate) {
    try {
      // Clean up past aggregation data if there is any. (Dont want duplicate aggregations)
      await cleanUpAggregation(startDate, endDate).then(async () => {
        // Fetch reporterOrganizations
        await fetchReporterOrg().then(async res => {
          // Aggregate by hour, day, week, month
          const aggregationTime = [1, 24, 24*7, 24*7*4]
          const t0 = performance.now()
          for(let i = 0; i < res.length; i++) {
            await aggregate(startDate, endDate, res[i].ReporterOrganization, aggregationTime[0])
            await aggregate(startDate, endDate, res[i].ReporterOrganization, aggregationTime[1])
            await aggregate(startDate, endDate, res[i].ReporterOrganization, aggregationTime[2])
            await aggregate(startDate, endDate, res[i].ReporterOrganization, aggregationTime[3])
          }
          console.log("Aggregation of data finished in time: " + (performance.now() - t0) + ".")
        }).catch(err => {
          throw(err)
        })
      }).catch(err => {
        throw(err)
      })
    } catch(error) {
        throw(error)
    }
  }
}

const aggregate = async (startDateInput, endDateInput, reporterOrganization, aggregationTime) => {
  let startDate = new Date(startDateInput.getTime())
  let endDate = new Date(endDateInput.getTime())
  let tempDate = new Date(startDate.getTime())
  
  while(startDate < endDate) {
    switch(aggregationTime) {
      case aggregationTime = 1:
        tempDate.setHours(tempDate.getHours() + 1)
        break
      case aggregationTime = 24:
        tempDate.setDate(tempDate.getDate() + 1)
        break
      case aggregationTime = 24*7:
        tempDate.setDate(tempDate.getDate() + 7)
        break
      case aggregationTime = 24*7*4:
        tempDate.setMonth(tempDate.getMonth() + 1)
        break
    }
    
    
    await fetchFrictionData(startDate, tempDate, reporterOrganization).then(async res => {
      let result = []
      // Take the friction data and aggregate it in groups.
      let res1KM = [...res]
      let res10KM = [...res]
      let res100KM = [...res]
      // Take the friction data and aggregate it in groups.
      const aggregatedData1KM = await aggregateData(res1KM, 1, aggregationTime)
      const aggregatedData10KM = await aggregateData(res10KM, 10, aggregationTime)
      const aggregatedData100KM = await aggregateData(res100KM, 100, aggregationTime)
      result = result.concat(aggregatedData1KM, aggregatedData10KM, aggregatedData100KM)
      if(result.length !== 0) {
        uploadAggregatedFrictionData(result)
      }
    }).catch(err => {
      throw(err)
    })

    // Increment start date by one.
    switch(aggregationTime) {
      case aggregationTime = 1:
        startDate.setHours(startDate.getHours() + 1)
        break
      case aggregationTime = 24:
        startDate.setDate(startDate.getDate() + 1)
        break
      case aggregationTime = 24*7:
        startDate.setDate(startDate.getDate() + 7)
        break
      case aggregationTime = 24*7*4:
        startDate.setMonth(startDate.getMonth() + 1)
        break
    }
  }
} 

/* Helper function to fetch friciton data from db
* @param data
*/
const fetchFrictionData = async (startDate, endDate, reporterOrganization) => {
  // Make sql query to fetch frictiondata
  return new Promise((resolve, reject) => {
    authorization.getConnection(function(err, pool){
      const sql = `
        SELECT 
          Id,
          ObservationTimeUTC,
          ReportTimeUTC,
          Longitude,
          Latitude,
          AreaCode,
          NumberOfMeasurements,
          MeasureValue,
          MeasureConfidence,
          ReporterOrganization
        FROM db.friction_data WHERE ObservationTimeUTC BETWEEN ? AND ? AND ReporterOrganization = ?
        ORDER BY Longitude DESC, Latitude DESC
        ;`
  
      pool.query(sql, [startDate, endDate, reporterOrganization], (err, response) => {
        pool.release()
        
        if(err) {
            return reject(err)
        }
        resolve(response)
      })
    })
  })
}

/* Helper function to fetch available reporter organizations
* @param data
*/
const fetchReporterOrg =  () => {
  return new Promise((resolve, reject) => {
    authorization.getConnection(function(err, conn){
      if (err) {
        return reject(err)
      }
        
      const sql =`SELECT DISTINCT ReporterOrganization FROM reporter_organizations;`
      conn.query(sql, function (err, results) {
        // if there is no resluts return
        if(results == null) {
          return;
        }
        // If no data try to query friction_data to get reporterOrganistaions
        if(results.length == 0) {
          const sql =`SELECT DISTINCT ReporterOrganization FROM friction_data;`
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
                  return reject(err)
                }
              })
            }
            conn.release()
            return resolve(results)
          })
        } else {
          conn.release()
          return resolve(results)
        }
        if (err) {
          return reject(err)
        }
      })
    })
  })
}

// Divide and conquer method for aggregating the data
const aggregateData = (data, radiusInKm, timeAggregation) => {
  if(data.length > 5000) {
    const firstHalf = aggregateData(data.splice(data.length/2), radiusInKm, timeAggregation)
    const secondHalf = aggregateData(data, radiusInKm, timeAggregation)
    return firstHalf.concat(secondHalf)
  } else {
    // Fetch the case when there is a day in which there is no data
    if(data.length === 0 || !data) {
      return []
    }

    const result = new Array
    // Loop through the data - Remove the points which are added to a group. Continue until all points
    // are added in groups. Each iteration will create 1 group.
    while(data.length > 0) {
      /* This solution uses the fact that the first data point always will be in the circle(since it is this
        data point which determines the middle point of the circle). The data group get the time, reporterOrganization
        longitude, latitude from the first data point
      */
      const lat = data[0].Latitude
      const long = data[0].Longitude
      const kmInLongitudeDegree = 111.320 * Math.cos( lat / 180.0 * Math.PI)
      const deltaLat = radiusInKm / 111.1;
      const deltaLong = radiusInKm / kmInLongitudeDegree;
      
      const minLat = lat - deltaLat;  
      const maxLat = lat + deltaLat;
      const minLong = long - deltaLong; 
      const maxLong = long + deltaLong;

      // groupObject contains one grouping of datapoints
      let groupObject = new Object
      groupObject.Time = data[0].ObservationTimeUTC
      groupObject.TimeAggregation = timeAggregation
      groupObject.Radius = radiusInKm
      groupObject.ReporterOrganization = data[0].ReporterOrganization
      groupObject.Longitude = data[0].Longitude
      groupObject.Latitude = data[0].Latitude
      // These numbers need to be updated by going through the grouping
      groupObject.NumberOfMeasurements = 0
      groupObject.MeasureValueMedian = 0
      groupObject.MeasureValueMax = data[0].MeasureValue
      groupObject.MeasureValueMin = data[0].MeasureValue
      groupObject.MeasureConfidenceMedian = 0
      groupObject.MeasureConfidenceMax = data[0].MeasureValue
      groupObject.MeasureConfidenceMin = data[0].MeasureValue
      groupObject.NrOfAddedDataPoints = 0
      
      data.forEach((row, index)=> {
        if(row.Latitude < maxLat && row.Latitude > minLat && row.Longitude < maxLong && row.Longitude > minLong) {
          groupObject.NumberOfMeasurements = groupObject.NumberOfMeasurements + parseFloat(row.NumberOfMeasurements)
          groupObject.MeasureValueMedian = groupObject.MeasureValueMedian + parseFloat(row.MeasureValue)
          if(row.MeasureValue > groupObject.MeasureValueMax) {
            groupObject.MeasureValueMax = parseFloat(row.MeasureValue)
          }
          if(row.MeasureValue < groupObject.MeasureValueMin) {
            groupObject.MeasureValueMin = parseFloat(row.MeasureValue)
          }
          groupObject.MeasureConfidenceMedian = groupObject.MeasureConfidenceMedian + parseFloat(row.MeasureConfidence)
          if(row.MeasureConfidence > groupObject.MeasureConfidenceMax) {
            groupObject.MeasureConfidenceMax = parseFloat(row.MeasureConfidence)
          }
          if(row.MeasureConfidence < groupObject.MeasureConfidenceMin) {
            groupObject.MeasureConfidenceMin = parseFloat(row.MeasureConfidence)
          }
          groupObject.NrOfAddedDataPoints++
          // remove row from array
          data.splice(index, 1)
        }
      })

      groupObject.MeasureValueMedian = groupObject.MeasureValueMedian / groupObject.NrOfAddedDataPoints
      groupObject.MeasureConfidenceMedian = groupObject.MeasureConfidenceMedian / groupObject.NrOfAddedDataPoints

      const {
        Time,
        TimeAggregation,
        Radius,
        ReporterOrganization,
        Longitude,
        Latitude,
        NumberOfMeasurements,
        MeasureValueMedian,
        MeasureValueMax,
        MeasureValueMin,
        MeasureConfidenceMedian,
        MeasureConfidenceMax,
        MeasureConfidenceMin,
        NrOfAddedDataPoints } = groupObject

        result.push([Time,
          TimeAggregation,
          Radius,
          ReporterOrganization,
          Longitude,
          Latitude,
          NumberOfMeasurements,
          MeasureValueMedian,
          MeasureValueMax,
          MeasureValueMin,
          MeasureConfidenceMedian,
          MeasureConfidenceMax,
          MeasureConfidenceMin,
          NrOfAddedDataPoints])
    }
    return result
  }
}

/* Helper function to upload aggregated friction data to to db
* @param data
*/
const uploadAggregatedFrictionData = (data) => {
  authorization.getConnection(function(err, pool){
    if(err){
      throw (err)
    }
    const sql = `
      INSERT INTO db.aggregated_friction_data (
        Time,
        TimeAggregation,
        Radius,
        ReporterOrganization,
        Longitude,
        Latitude,
        NumberOfMeasurements,
        MeasureValueMedian,
        MeasureValueMax,
        MeasureValueMin,
        MeasureConfidenceMedian,
        MeasureConfidenceMax,
        MeasureConfidenceMin,
        NrOfAddedPoints)
      VALUES ?
      ;`
    
    pool.query(sql, [data],(err, response) => {
      pool.release()
      if(err) {
          throw (err)
      }
    })
  })
}
// Function to clean up past aggregation so that data cannot be aggregated multiple times (Theres never a valid reason for this)
const cleanUpAggregation = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    authorization.getConnection(function(err, conn){
      if (err) {
        return reject(err)
      }
      const sql =`
        DELETE FROM db.aggregated_friction_data
        WHERE Time BETWEEN ? AND ?;`
      conn.query(sql, [startDate, endDate], function (err, results) {
        conn.release()
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
}