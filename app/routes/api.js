var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
const { promisify } = require('util')

var test = require('../database/testConnection');
var station = require('../database/getStationData');
var weather = require('../database/getWeatherData');
var province = require('../database/getProvinceData');
var friction = require('../database/getFrictionData');
var camera = require('../database/getCameraData');
var uploadFrictionData = require('../database/uploadFrictionData');
var accident = require('../database/getAccidentData');

const upload = multer({dest:'uploads/'});
const unlinkAsync = promisify(fs.unlink)

/*

GEt Accident Data
 */

router.get('/getAccidentData', function(req, res, next){
    try{
    datumStart = req["query"]["startTime"];
    datumEnd = req["query"]["endTime"];
    accident.getAccidentData(req, res, next, datumStart, datumEnd);
    } catch(error) {
        console.log(error);
    }
});

router.get('/getAccidentWeather', function(req, res, next){
    try{
    datumStart = req["query"]["start_time"];
    datumEnd = req["query"]["stop_time"];
    county = req["query"]["county"];
    accident.getAccidentWeather(req, res, next, county, datumStart, datumEnd);
    } catch(error) {
	console.log(error);
    }
});

/* Get weatherdata from given a station id and creationtime of accident */
router.get('/getAccidentWeatherStation', function(req,res,next){
    try{
    station = req["query"]["stationID"];
    datumStart = req["query"]["creation_time"];
    accident.getAccidentWeatherStation(req,res,next, datumStart, station);
    } catch(error) {
	console.log(error);
    }
});
/* Get weatherdata for an accident in popupAccident */
router.get('/getAccidentWeatherStationData', function(req,res){
    try{
    accidentTime = req["query"]["accidentTime"];
    accidentStation = req["query"]["accidentStation"];
    accident.getAccidentWeatherStationData(req,res,accidentTime,accidentStation);
    } catch(error) {
	console.log(error);
    }
});
/* Get the closest station for the accident */
router.get('/getAccidentStation', function(req,res){
    try{
    lon = req["query"]["lon"];
    lat = req["query"]["lat"];
    countyNum = req["query"]["countyNum"];
    accident.getAccidentStation(req,res,lon,lat,countyNum);
    } catch(error) {
	console.log(error);
    }
});
/* Find all accidents whose closest station is the station given */
router.get('/findClosestAccidents', function(req,res,next){
    try{
    station = req["query"]["id"];
    accident.findClosestAccidents(req,res,next,station);
    } catch (error) {
	console.log(error);
    }
});

/* GET dATA CAMERA_DATA */
router.get('/getCameraData', function(req, res, next) {
    camera.getCameraData(req,res,next);
});


/* GET DISTINCT REPORTER ORG FROM FRICTION_DATA */
router.get('/getDistinctReporterorgFriction', function(req, res, next) {
    friction.getDistinctReporterorgFriction(req,res,next);
});


/* GET LATEST FROM FRICTION_DATA WITH ID */
router.get('/getLatestFrictionData', function(req, res, next) {
    friction_id = req["query"]["friction_id"];
    friction.getLatestFrictionData(req,res,next,friction_id);
});

/* GET FROM FRICTION_DATA WITH COORDINATES BOUNDS FROM DRAW RECT TOOL */
router.get('/getFrictionDataRect', function(req, res, next) {
    reporter = req["query"]["reporter"];
    NElat = req["query"]["NElat"];
    NElon = req["query"]["NElon"];
    SWlat = req["query"]["SWlat"];
    SWlon = req["query"]["SWlon"];
    friction.getFrictionDataRect(req, res, next, reporter, SWlat, NElat, SWlon, NElon);

});

/* GET FROM FRICTION_dATA WITH LAT,LON AND RADIUS AND EVERY THING INSIDE THAT*/
router.get('/getFrictionDataCirc', function(req,res,next){
    reporter = req["query"]["reporter"];
    lat = req["query"]["lat"];
    lon = req["query"]["lon"];
    radius = req["query"]["radius"];
    friction.getFrictionDataCirc(req,res,next,reporter,lat,lon,radius);

});

/* GET FROM FRICTION BY REPORTERORG  */
router.get('/getFrictionData', function(req, res, next) {
    reporter = req["query"]["reporter"];
    friction.getFrictionData(req, res, next, reporter);
});

/* GET FROM AGGREGATED FRICTION DATA  */
router.get('/getAggregatedFrictionData', function(req, res, next) {
    try{
        const distance = req["query"]["distance"];
        const timeAggregation = req["query"]["timeAggregation"];
        const startTime = req["query"]["startTime"];
        const endTime = req["query"]["endTime"];
        const reporterOrganization = req["query"]["reporterOrganization"]
        const mapBounds = req["query"]["mapBounds"]
        const maxFriction = req["query"]["maxFriction"]
        const autoAggregation = req["query"]["autoAggregation"]
        
        if(autoAggregation === "true") {
            // Auto aggregate
            friction.autoAggregate(res, startTime, endTime, reporterOrganization, mapBounds, maxFriction)
        } else {
            if(distance === "No Aggregation") {
                friction.getSpecificFrictionData(startTime, endTime, reporterOrganization, mapBounds, maxFriction).then(result => {
                    if(result.length > 50000) {
                        res.send({ success:false, autoAggregation:false })
                    } else {
                        res.send({ distance:'No Aggregation', timeAggregation:'No Aggregation', result,  success: true, autoAggregation:false })
                    }
                })
            } else {
                friction.getAggregatedFrictionData(distance, timeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction).then(result => {
                    if(result.length > 50000) {
                        res.send({ success:false, autoAggregation:false })
                    } else {
                        res.send({ result, success:true, autoAggregation:false })
                    }
                })
            }
        }
    } catch(error) {
        console.log(error)
    }
});

/* GET ALL FROM FRICTION DATA */
router.get('/getAllFrictionData', function(req, res, next) {
    friction.getAllFrictionData(req, res, next);
});


/* GET test connection */
router.get('/testDbConnection', function(req, res, next) {
  
    test.testConnection(req,res,next);
});

/* GET station data */
router.get('/getStationData', function(req, res, next) {
  
    station.getStationData(req,res,next);
});

/* GET latest AVG temp over province */
router.get('/getLatestAverageTempProvince', function(req, res, next) {
    
    province.getLatestAverageTempProvince(req,res,next);
});

/* GET AVG temp over province over time */
router.get('/getAverageTempProvince', function(req, res, next) {
    counties = req["query"]["counties"];
    start_time = req["query"]["start_time"];
    stop_time = req["query"]["stop_time"];

    //let provinces = [25,24, 5];
    //let start_time = "2019-02-10 10:40:00"
    //let stop_time = "2019-02-19 11:10:00"

    province.getAverageTempProvince(req,res,next, counties, start_time, stop_time);
});


/* GET weather data */
router.get('/getLatestWeatherData', function(req, res, next) {
    
    station_id = req["query"]["station_id"];
    //station_id = ["SE_STA_VVIS2429", "SE_STA_VVIS2529"];
    weather.getLatestWeatherData(req,res,next,station_id);
});

/* GET weather data */
router.get('/getAllLatestWeatherData',  function(req, res, next) {
    weather.getAllLatestWeatherData(req,res,next);
});

/* GET weather data over time */
router.get('/getWeatherData', function(req, res, next) {
    
    station_id = req["query"]["station_id"];
    start_time = req["query"]["start_time"];
    stop_time = req["query"]["stop_time"];

    // station_id = ["SE_STA_VVIS2429", "SE_STA_VVIS2529"];
    // start_time = "2019-02-19 10:40:00"
    // stop_time = "2019-02-19 11:10:00"

  
    weather.getWeatherData(req,res,next,station_id, start_time, stop_time);

    
});

/* GET weather data over time */
router.get('/getAverageWeatherData', function(req, res, next) {
    
    station_id = req["query"]["station_id"];
    start_time = req["query"]["start_time"];
    stop_time = req["query"]["stop_time"];
    
    weather.getAverageWeatherData(req,res,next,station_id, start_time, stop_time);
});

/* GET data date range for friction and accident data used to set boundary for slider*/
router.get('/getDataDateRange', async (req, res, next) => {
    frictionPromise = friction.getDataDateRange(req, res, next)
    accidentPromise = accident.getDataDateRange(req, res, next)
    await Promise.all([frictionPromise, accidentPromise]).then(data => {
        const startDateFriction = data[0][0].startDate
        const endDateFriction = data[0][0].endDate
        const startDateAccident = new Date(data[1][0].startDate)
        const endDateAccident = new Date(data[1][0].endDate)
        const startDate = startDateFriction < startDateAccident ? startDateFriction : startDateAccident
        const endDate = endDateFriction > endDateAccident ? endDateFriction : endDateAccident
        res.send({startDate, endDate});
    })
})

/* POST frictiondata to db. Request contains a .csv file. */
router.post('/uploadFrictionData', upload.single('file'), async (req, res, next) => {
    await uploadFrictionData.uploadFrictionData(req.file)

    // Delete the file
    await unlinkAsync(req.file.path)
    res.end("Upload completed!")

})

module.exports = router;
