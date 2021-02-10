
/**
 * Get weatherdata from the stations sent in.
 * With the data you send it to graph.js to generate data for graphs
 * @param {*} station_id Station id, used to get the data from api
 * @param {*} start_time start time to get data from
 * @param {*} stop_time  stop time to get data from
 * @param {*} station_name station name instead of id, used to show name in graphs
 */
async function getWeatherData(station_id, start_time, stop_time,station_name) {		
	await $.getJSON("/api/getWeatherData", {station_id, start_time, stop_time}, function(weatherData) {
		for(let i = 0; i < weatherData.length; i++){
				datamultieplegraf(weatherData[i],station_name[i]);
				datamultieplegrafair(weatherData[i],station_name[i]);
				datamultieplegrafhumidity(weatherData[i],station_name[i]);
				datamultieplegrafwinspeed(weatherData[i],station_name[i]);
				datamultieplegrafaccidentcorrelation(weatherData[i],station_name[i]);
		}
		
    });	
}


/**
 * Get current latest weatherdata from the stations sent in.
 * With the data you send it to graph.js to generate data for graphs
 * @param {*} station_id station id, used to get the data from api
 * @param {*} station_name tation name instead of id, used to show name in graphs
 */
async function getlatest(station_id,station_name) {
    await $.getJSON("/api/getLatestWeatherData", {station_id}, function(weatherData) {
		

	for(let i = 0; i < weatherData.length; i++){
			databarchartcurrent(weatherData[i],station_name[i]);
			databarchartroadcurrent(weatherData[i],station_name[i]);
			databarcharthumcurrent(weatherData[i],station_name[i]);
			databarchartwindcurrent(weatherData[i],station_name[i]);
			databarchartsaccidents(weatherData[i],station_name[i]);
	}
    });	
}

/**
 * Get the average temp for province from API.
 * With the data you send it to graph.js to generate data for graphs
 * @param {*} counties The chosen counties sent in
 * @param {*} start_time start time to get data from
 * @param {*} stop_time stop time to get data from
 */
async function getAverageTempProvince(counties, start_time, stop_time) {	
	await $.getJSON("/api/getAverageTempProvince", {counties, start_time, stop_time}, function(AverageTempProvinceData) {
		//console.log("VALUES IN GETWEATHERDATA",AverageTempProvinceData)
		//console.log(chosenCounties)
		var max=[];
		var imax=0;
		for(var i=0;i<chosenCounties.length;i++){
			if (AverageTempProvinceData[i].length>max){
				max=AverageTempProvinceData[i].length;
				imax=i
			}
			
			//databarchartcurrentprovroad(AverageTempProvinceData[i],chosenCounties[i]);
		}
		datamultieplegraftempprov(AverageTempProvinceData[imax],countyNames[chosenCounties[imax]]);

		
		for(var i=0;i<chosenCounties.length;i++){
			if (i!=imax){
				console.log("hello");
				datamultieplegraftempprov(AverageTempProvinceData[i],countyNames[chosenCounties[i]]);
			}
			
			//databarchartcurrentprovroad(AverageTempProvinceData[i],chosenCounties[i]);
		}
    });	
}
/**
 * Get latest avg county data.
 * With the data you send it to graph.js to generate data for graphs
 * @param {*} chosenCounties  The chosen counties sent in
 */
async function getLatestAvgCountyWeatherData(chosenCounties){
      await $.getJSON('/api/getLatestAverageTempProvince', function(averageCountyWeather) {
          averageData = averageCountyWeather;
	  for(var i=0;i<chosenCounties.length;i++){
		databarchartcurrentprovair(averageData[chosenCounties[i]][1],countyNames[chosenCounties[i]]);
		databarchartcurrentprovroad(averageData[chosenCounties[i]][2],countyNames[chosenCounties[i]]);

	}
      });
}

/*
//Get current latest weatherdata from the stations sent in
async function getlatest(station_id,station_name) {


// loop through every given station id and get the find the 
	// weatherdata of that station in the latestWeather list
	for(let j = 0; j < station_id.length; j++){

		for(let i = 0; i < latestWeatherData.length; i++){
			// when found, draw the graphs
			if(station_id[j] == latestWeatherData[i].station_id){
				databarchartcurrent(latestWeatherData[i],station_name[j]);
				databarchartroadcurrent(latestWeatherData[i],station_name[j]);
				databarcharthumcurrent(latestWeatherData[i],station_name[j]);
				databarchartwindcurrent(latestWeatherData[i],station_name[j]);
				break;
			}
		}
		
	}
}
*/

