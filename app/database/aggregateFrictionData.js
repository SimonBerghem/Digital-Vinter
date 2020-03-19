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
            console.log("Aggregating friction data from reporterOrganization: " + res[i].ReporterOrganization)
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
  // lastIterationFlag is a flag which gets set when the time loop is att the last iteration. This needs to be done
  // since the query to get fricitondata is not doubly inclusive for start and enddate (it is [startDate, endDate)
  // NOT [startDate, endDate]). This is done intentionally since we dont want to aggregate friciondata on borders twice.
  let lastIterationFlag = false

  while(startDate < endDate) {
    switch(aggregationTime) {
      case aggregationTime = 1:
        tempDate.setHours(tempDate.getHours() + 1)
        if(tempDate >= endDate) {
          lastIterationFlag = true
        }
        break
      case aggregationTime = 24:
        tempDate.setDate(tempDate.getDate() + 1)
        if(tempDate >= endDate) {
          lastIterationFlag = true
        }
        break
      case aggregationTime = 24*7:
        tempDate.setDate(tempDate.getDate() + 7)
        if(tempDate >= endDate) {
          lastIterationFlag = true
        }
        break
      case aggregationTime = 24*7*4:
        tempDate.setMonth(tempDate.getMonth() + 1)
        if(tempDate >= endDate) {
          lastIterationFlag = true
        }
        break
    }

    await fetchFrictionData(startDate, tempDate, reporterOrganization, lastIterationFlag).then(res => {
      let result = []
      // Take the friction data and aggregate it in groups.
      let res1KM = [...res]
      let res10KM = [...res]
      let res100KM = [...res]
      // Take the friction data and aggregate it in groups.
      let aggregatedData1KM = aggregateData(res1KM, 1, aggregationTime)
      // Aggregate the aggregation to fix that the solution was split
      const aggregatedAggregation1KM = aggregateAggregation(aggregatedData1KM, 1)
      let aggregatedData10KM = aggregateData(res10KM, 10, aggregationTime)
      const aggregatedAggregation10KM = aggregateAggregation(aggregatedData10KM, 10)
      let aggregatedData100KM = aggregateData(res100KM, 100, aggregationTime)
      const aggregatedAggregation100KM = aggregateAggregation(aggregatedData100KM, 100)
      result = result.concat(aggregatedAggregation1KM, aggregatedAggregation10KM, aggregatedAggregation100KM)
      if(result.length !== 0) {
        uploadAggregatedFrictionData(result, aggregationTime)
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
const fetchFrictionData = async (startDate, endDate, reporterOrganization, lastIterationFlag) => {
  // Make sql query to fetch frictiondata
  return new Promise((resolve, reject) => {
    authorization.getConnection(function(err, pool){
      let sql = ""
      if(lastIterationFlag) {
        sql = `
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
        FROM db.friction_data WHERE ObservationTimeUTC > ? AND ObservationTimeUTC <= ? AND ReporterOrganization = ?
        ORDER BY Longitude DESC, Latitude DESC
        ;`
      } else {
        sql = `
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
          FROM db.friction_data WHERE ObservationTimeUTC >= ? AND ObservationTimeUTC < ? AND ReporterOrganization = ?
          ORDER BY Longitude DESC, Latitude DESC
          ;`
      }
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
const aggregateData = (data, distanceInKm, timeAggregation) => {
  if(data.length > 500) {
    const firstHalf = aggregateData(data.splice(data.length/2), distanceInKm, timeAggregation)
    const secondHalf = aggregateData(data, distanceInKm, timeAggregation)
    return firstHalf.concat(secondHalf)
  } else {
    // Catch the case when there is a day in which there is no data
    if(data.length === 0 || !data) {
      return []
    }

    const result = new Array
    // Loop through the data - Remove the points which are added to a group. Continue until all points
    // are added in groups. Each iteration will create 1 group.
    while(data.length > 0) {
      /* This solution uses the fact that the first data point always will be in the rectangle(since it is this
        data point which determines the middle point of the rectangle). The data group get the time, reporterOrganization
        longitude, latitude from the first data point
      */
      const lat = parseFloat(data[0].Latitude)
      const long = parseFloat(data[0].Longitude)
      const kmInLongitudeDegree = 111.320 * Math.cos( lat / 180.0 * Math.PI)
      const deltaLat = distanceInKm / 111.1;
      const deltaLong = distanceInKm / kmInLongitudeDegree;
      
      const minLat = lat - deltaLat;  
      const maxLat = lat + deltaLat;
      const minLong = long - deltaLong; 
      const maxLong = long + deltaLong;

      // groupObject contains one grouping of datapoints
      let groupObject = new Object
      groupObject.Time = data[0].ObservationTimeUTC
      groupObject.TimeAggregation = timeAggregation
      groupObject.Distance = distanceInKm
      groupObject.ReporterOrganization = data[0].ReporterOrganization
      groupObject.Longitude = data[0].Longitude
      groupObject.Latitude = data[0].Latitude
      // These numbers need to be updated by going through the grouping
      groupObject.NumberOfMeasurements = 0
      groupObject.MeasureValueMedian = 0
      groupObject.MeasureValueMax = parseFloat(data[0].MeasureValue)
      groupObject.MeasureValueMin = parseFloat(data[0].MeasureValue)
      groupObject.MeasureConfidenceMedian = 0
      groupObject.MeasureConfidenceMax = parseFloat(data[0].MeasureValue)
      groupObject.MeasureConfidenceMin = parseFloat(data[0].MeasureValue)
      groupObject.NrOfAddedDataPoints = 0

      data.forEach((row, index)=> {
        if(parseFloat(row.Latitude) <= maxLat && parseFloat(row.Latitude) >= minLat && parseFloat(row.Longitude) < maxLong && parseFloat(row.Longitude) > minLong) {
          groupObject.NumberOfMeasurements = groupObject.NumberOfMeasurements + parseFloat(row.NumberOfMeasurements)
          groupObject.MeasureValueMedian = groupObject.MeasureValueMedian + parseFloat(row.MeasureValue)
          if(parseFloat(row.MeasureValue) > groupObject.MeasureValueMax) {
            groupObject.MeasureValueMax = parseFloat(row.MeasureValue)
          }
          if(parseFloat(row.MeasureValue) < groupObject.MeasureValueMin) {
            groupObject.MeasureValueMin = parseFloat(row.MeasureValue)
          }
          groupObject.MeasureConfidenceMedian = groupObject.MeasureConfidenceMedian + parseFloat(row.MeasureConfidence)
          if(parseFloat(row.MeasureConfidence) > groupObject.MeasureConfidenceMax) {
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
        Distance,
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
          Distance,
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

const aggregateAggregation = (data, distanceInKm) => {
  const result = new Array
    // Loop through the data - Remove the points which are added to a group. Continue until all points
    // are added in groups. Each iteration will create 1 group.
    while(data.length > 0) {
      /* This solution uses the fact that the first data point always will be in the circle(since it is this
        data point which determines the middle point of the circle). The data group get the time, reporterOrganization
        longitude, latitude from the first data point
      */
      const lat = parseFloat(data[0][5])
      const long = parseFloat(data[0][4])
      const kmInLongitudeDegree = 111.320 * Math.cos( lat / 180.0 * Math.PI)
      const deltaLat = distanceInKm / 111.1;
      const deltaLong = distanceInKm / kmInLongitudeDegree;
      
      const minLat = lat - deltaLat;  
      const maxLat = lat + deltaLat;
      const minLong = long - deltaLong; 
      const maxLong = long + deltaLong;
      

      // groupObject contains one grouping of datapoints
      let groupObject = new Object
      groupObject.Time = data[0][0]
      groupObject.TimeAggregation = data[0][1]
      groupObject.Distance = distanceInKm
      groupObject.ReporterOrganization = data[0][3]
      groupObject.Longitude = data[0][4]
      groupObject.Latitude = data[0][5]
      // These numbers need to be updated by going through the grouping
      groupObject.NumberOfMeasurements = parseFloat(data[0][6])
      groupObject.MeasureValueMedian = 0
      groupObject.MeasureValueMax = parseFloat(data[0][8])
      groupObject.MeasureValueMin = parseFloat(data[0][9])
      groupObject.MeasureConfidenceMedian = 0
      groupObject.MeasureConfidenceMax = parseFloat(data[0][11])
      groupObject.MeasureConfidenceMin = parseFloat(data[0][12])
      groupObject.NrOfAddedDataPoints = 0
      groupObject.NrOfAggregationsAdded = 0
          /*
          [0]   Time,
          [1]   TimeAggregation,
          [2]   Distance,
          [3]   ReporterOrganization,
          [4]   Longitude,
          [5]   Latitude,
          [6]   NumberOfMeasurements,
          [7]   MeasureValueMedian,
          [8]   MeasureValueMax,
          [9]   MeasureValueMin,
          [10]  MeasureConfidenceMedian,
          [11]  MeasureConfidenceMax,
          [12]  MeasureConfidenceMin,
          [13]  NrOfAddedDataPoints */

      data.forEach((row, index)=> {
        if(parseFloat(row[5]) < maxLat && parseFloat(row[5]) > minLat && parseFloat(row[4]) < maxLong && parseFloat(row[4]) > minLong) {
          groupObject.NumberOfMeasurements = groupObject.NumberOfMeasurements + parseFloat(row[6])
          groupObject.MeasureValueMedian = groupObject.MeasureValueMedian + parseFloat(row[7])
          if(parseFloat(row[8]) > groupObject.MeasureValueMax) {
            groupObject.MeasureValueMax = parseFloat(row[8])
          }
          if(parseFloat(row[9]) < groupObject.MeasureValueMin) {
            groupObject.MeasureValueMin = parseFloat(row[9])
          }
          groupObject.MeasureConfidenceMedian = groupObject.MeasureConfidenceMedian + parseFloat(row[10])
          if(parseFloat(row[11]) > groupObject.MeasureConfidenceMax) {
            groupObject.MeasureConfidenceMax = parseFloat(row[11])
          }
          if(parseFloat(row[12]) < groupObject.MeasureConfidenceMin) {
            groupObject.MeasureConfidenceMin = parseFloat(row[12])
          }
          groupObject.NrOfAddedDataPoints = groupObject.NrOfAddedDataPoints + parseFloat(row[13])
          groupObject.NrOfAggregationsAdded++
          // remove row from array
          data.splice(index, 1)
        }
      })

      groupObject.MeasureValueMedian = groupObject.MeasureValueMedian / groupObject.NrOfAggregationsAdded
      groupObject.MeasureConfidenceMedian = groupObject.MeasureConfidenceMedian / groupObject.NrOfAggregationsAdded

      const {
        Time,
        TimeAggregation,
        Distance,
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
          Distance,
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

/* Helper function to upload aggregated friction data to to db
* @param data
*/
const uploadAggregatedFrictionData = (data, timeAggregation) => {
  authorization.getConnection(function(err, pool){
    if(err){
      throw (err)
    }
    const sql = `
      INSERT INTO db.aggregated_friction_data (
        Time,
        TimeAggregation,
        Distance,
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