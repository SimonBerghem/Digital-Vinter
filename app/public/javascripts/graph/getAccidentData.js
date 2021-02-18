/** Get weather data from accident
 *  Send the data to graph.js to generate graphs
 * @param {*} county_no county number
 * @param {*} start_time start time to get data from
 * @param {*} stop_time stop time to get data from
 */
async function getAccidentWeather(county_no, start_time, stop_time) {
    await $.getJSON("/api/getAccidentId", {county_no, start_time, stop_time}, function(accidentID){
	var accidentData = [];
	for(let i = 0; i < accidentID.length; i++){
	    accidentRow = getWeather(accidentID);
	    accidentData.push(accidentRow);
	}
	// Graf funktioner för att sätta in data
    });
}

async function getWeather(accidentID) {
    await $.getJSON("/api/getAccidentWeather", {accidentID}, function(accidentRow){
	return accidentRow;
    });
}

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
		weatherdata.push(accidentWeatherRow[0]);
 	    });
        }
        datamultieplegrafaccidentcorrelation(weatherdata, station_name[i]);
    }
}

