/** 
 * Get weather and some accident data in chosen counties
 * Send data to graph.js to store in arrays local to graph writing functions
 * @param{*} county_no, the county number (int)
 * @param{*} start_time, lowest time we look for accidents
 * @param{*} stop_time, highest time we look for accidents
 */
async function getAccidentWeather(county_no, start_time, stop_time) {

    for(let i = 0; i < county_no.length; i++){
	var county = county_no[i];
	await $.getJSON("/api/getAccidentWeather", {county, start_time, stop_time}, function(weatherdata){
	    console.log(weatherdata);
	    Datapointdecisionaccidentcounties(weatherdata, countyNames[county]);
	});
    }
}


/**
 * Get weather and some accident data of the accidents closest to chosen stations
 * Send data to graph.js to store in arrays local to graph writing functions
 * @param{*} station_id, array with id of chosen stations
 * @param{*} station_name, array with names of chosen stations
 */
async function getAccidentWeatherStation(station_id, station_name) {
    var allAccidents = [];
    for(let i = 0; i < station_id.length; i++){
	var id = station_id[i];
    	await $.getJSON("/api/findClosestAccidents", {id}, function(accidents){
	    allAccidents.push(accidents);
	});
    }
    for(let i = 0; i < station_id.length; i++){
	var weatherdata = [];
    	for(let j = 0; j < allAccidents[i].length; j++){
	    var creation_time = allAccidents[i][j].CreationTime;
	    var stationID = station_id[i];
	    await $.getJSON("/api/getAccidentWeatherStation", {creation_time, stationID}, function(accidentWeatherRow){
		if (allAccidents[i][j].SeverityCode != ''){
		    accidentWeatherRow[0]["SeverityCode"] = parseInt(allAccidents[i][j].SeverityCode);
		} else {
		    accidentWeatherRow[0]["SeverityCode"] = 0;
		}
		weatherdata.push(accidentWeatherRow[0]);
 	    });
        }
	console.log(weatherdata);
        datamultieplegrafaccidentcorrelation(weatherdata, station_name[i]);
    }
}

