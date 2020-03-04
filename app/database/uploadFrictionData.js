const fs = require('fs')
const papa = require('papaparse')
const authorization = require('./authorization').pool;
const { performance } = require('perf_hooks');
const aggregate = require('./aggregateFrictionData')

/* Functions in the DB class that is usable by other files */
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */

module.exports = {

  /* Parses and uploads friction data to database. Contains a couple of constants which might be worth experimenting with if server is running bad. "nrOfChunks"
  * @param file
  */
  uploadFrictionData: function (file) {
    try {
      // Read file from temporary localstorage /uploads
      fs.readFile(file.path, 'utf-8', (err, data) => {
        parse(data)
      })
    } catch(error) {
        throw(error)
    }
  }
}

/* Helper function to parse and send data.
* @param data, chuckSize
*/
const parse = (data) => {
  // Replace mixed linebreaks \r\n with just \n
  data = data.replace(/[\r\n]+/g, '\n');

  // Papa parse with a worker thread
  papa.parse(data, {
    worker: true,
    header: true,
    delimiter: ';',
    newline: '\n',
    transformHeader: h => h.trim(),
    skipEmptyLines: true,
    complete: ({ data }) => {
      try{
        // remove header
        data.splice(0,1)
        /* The arrays reporterOragnisations, addedReporterOrganizations and frictionData are used to gather repoterOrganizations
        *  and frictionData into arrays ready to be inserted into the database.
        */ 
        let startDate = data[0].ObservationTimeUTC
        let endDate = data[0].ObservationTimeUTC
        
        let reporterOrganizations = []
        let addedReporterOrganizations = []
        let frictionData = []
        data.forEach(row => {
          if(!addedReporterOrganizations.includes(row.ReporterOrganization)) {
            reporterOrganizations.push([row.ReporterOrganization])
            addedReporterOrganizations.push(row.ReporterOrganization)
          }
          if(startDate > row.ObservationTimeUTC) {
            startDate = row.ObservationTimeUTC
          }
          if(endDate< row.ObservationTimeUTC) {
            endDate = row.ObservationTimeUTC
          }
          frictionData.push([
            row.Id,
            row.ObservationTimeUTC,
            row.ReportTimeUTC,
            row.Longitude,
            row.Latitude,
            row.AreaCode,
            row.NumberOfMeasurements,
            row.MeasureValue,
            row.MeasureConfidence,
            row.ReporterOrganization
            ])
        })
        updateReporterOrganizationsTable(reporterOrganizations)

        let startDateObject = new Date(startDate)
        let endDateObject = new Date(endDate)

        // Upload the data sequentially in rounds, do 1000 rows each insert (did some testing to see which insert size is fastest)
        const t0 = performance.now()
        sendFrictionData(frictionData, 1000, t0, startDateObject, endDateObject)
      } catch(error) {
        console.log(error)
      }
    },
  })
}

/* Helper function to send fricitondata to db
* @param data, stepSize
*/
const sendFrictionData = (data, stepSize, t0, startDate, endDate) => {
  // Make sql query to insert frictiondata
  authorization.getConnection(async function(err, pool){
    if(err){
      throw (err)
    }
    const sql = `
      INSERT INTO db.friction_data (
        Id,
        ObservationTimeUTC,
        ReportTimeUTC,
        Longitude,
        Latitude,
        AreaCode,
        NumberOfMeasurements,
        MeasureValue,
        MeasureConfidence,
        ReporterOrganization)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        ObservationTimeUTC=VALUES(ObservationTimeUTC),
        ReportTimeUTC=VALUES(ReportTimeUTC),
        Longitude=VALUES(Longitude),
        Latitude=VALUES(Latitude),
        AreaCode=VALUES(AreaCode),
        NumberOfMeasurements=VALUES(NumberOfMeasurements),
        MeasureValue=VALUES(MeasureValue),
        MeasureConfidence=VALUES(MeasureConfidence),
        ReporterOrganization=VALUES(ReporterOrganization)
      ;`

    // CASE: the data left to add to DB is less then stepSize, no need to splice just add the data and we are done
    // After this begin aggregation on the previous data
    if(stepSize >= data.length) {
      await pool.query(sql, [data],(err, response) => {
        const t1 = performance.now()
        console.log("Upload of frictiondata finished in time: " + (t1-t0) + " ms.")
        pool.release()
        aggregate.aggregateFrictionData(startDate, endDate)
        if(err) {
            throw (err)
        }
      })
    } else {
      // CASE: part of the data is uploaded to db, after this request is done start to upload new part.
      await pool.query(sql, [data.splice(0, stepSize)], async (err, response) => {
        sendFrictionData(data, stepSize, t0, startDate, endDate)
        pool.release()
        if(err) {
            throw (err)
        }
      })
    }
  })
}

/* Helper function to send reporterOrganistaions to db
* @param data
*/
const updateReporterOrganizationsTable = (data) => {
  // Make sql query to insert into reporterOrganizations table
  authorization.getConnection(async function(err, pool) {
    if(err){
      throw (err)
    }
    
    // INSERT IGNORE reporterOrganizations, notice that this query will not show errors but this is not required since the table is simple (no constraints, foreing keys etc.)
    const sql = `
      INSERT IGNORE INTO reporter_organizations
      VALUES ?;
      `

    await pool.query(sql, [data], async (err, response) => {
      pool.release()
      if(err) {
          throw (err)
      }
    })
  })
}