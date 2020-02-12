const fs = require('fs')
const papa = require('papaparse')
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
  uploadFrictionData: function (file) {
    try {
      const delay = 250
      // Read file from temporary localstorage /uploads
      fs.readFile(file.path, 'utf-8', (err, data) => {
        parse(data, delay)
      }) 
    } catch(error) {
        throw(error)
    }
  }
}

/* Helper function to parse and send data.
* @param data, delay, chuckSize
*/
const parse = (data, delay) => {
  // Replace mixed linebreaks \r\n with just \n
  data = data.replace(/[\r\n]+/g, '\n');

  // Papa parse with a worker thread
  papa.parse(data, {
    worker: true,
    header: false,
    delimiter: ';',
    newline: '\n',
    skipEmptyLines: true,
    beforeFirstChunk: (data) => {
      // Remove header field
      return data.split('\n').slice(1).join('\n')
    },
    complete: ({ data }) => {
      try{
        let reporterOrganisations = []
        let addedReporterOrganisations = []
        data.forEach(row => {
          if(!addedReporterOrganisations.includes(row[11])) {
            reporterOrganisations.push([row[11]])
            addedReporterOrganisations.push(row[11])
          }
        })
        updateReporterOrganisationsTable(reporterOrganisations)

        // Upload the data sequentially in rounds, do 1000 rows each insert (did some testing to see which insert size is fastest)
        const t0 = performance.now()
        sendFrictionData(data, 1000, delay, t0)
       
      } catch(error) {
        console.log(error)
      }
    },
  })
}

/* Helper function to send fricitondata to db
* @param data, stepSize, delay
*/
const sendFrictionData = (data, stepSize, delay, t0) => {
  //console.log(data.length)
  // Make sql query to insert frictiondata
  authorization.getConnection(async function(err, pool){
    if(err){
      throw (err)
    }
    
    const sql = `
      INSERT INTO db.friction_data (
        Id,
        MeasureTimeUTC,
        ReportTimeUTC,
        Latitude,
        Longitude,
        RoadCondition,
        MeasurementType,
        NumberOfMeasurements,
        MeasurementValue,
        MeasurementConfidence,
        MeasurementsVelocity,
        ReporterOrganisation)
      VALUES ?
      ON DUPLICATE KEY UPDATE MeasureTimeUTC=VALUES(MeasureTimeUTC),
        ReportTimeUTC=VALUES(ReportTimeUTC),
        Latitude=VALUES(Latitude),
        Longitude=VALUES(Longitude),
        RoadCondition=VALUES(RoadCondition),
        MeasurementType=VALUES(MeasurementType),
        NumberOfMeasurements=VALUES(NumberOfMeasurements),
        MeasurementValue=VALUES(MeasurementValue),
        MeasurementConfidence=VALUES(MeasurementConfidence),
        MeasurementsVelocity=VALUES(MeasurementsVelocity),
        ReporterOrganisation=VALUES(ReporterOrganisation)
      ;`

    // CASE: the data left to add to DB is less then stepSize, no need to splice just add the data and we are done
    if(stepSize >= data.length) {
      await pool.query(sql, [data],(err, response) => {
        const t1 = performance.now()
        console.log("Upload of frictiondata finished in time: " + (t1-t0) + " ms.")
        pool.release()
        if(err) {
            throw (err)
        }
      })
    } else {
      // CASE: part of the data is uploaded to db, after this request is done start to upload new part.
      await pool.query(sql, [data.splice(0, stepSize)], async (err, response) => {
        sendFrictionData(data, stepSize, delay, t0)
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
const updateReporterOrganisationsTable = (data) => {
  // Make sql query to insert into reporterOrganisations table
  authorization.getConnection(async function(err, pool) {
    if(err){
      throw (err)
    }
    
    // INSERT IGNORE reporterOrganisations, notice that this query will not show errors but this is not required since the table is simple (no constraints, foreing keys etc.)
    const sql = `
      INSERT IGNORE INTO reporter_organisations
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