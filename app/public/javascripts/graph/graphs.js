//A bunch of arrays which holds the data generated from generatedataforbar to be used in as current graphdata
var currentdaggpunkt = [];
var currentdatawind = [];
var currentdatatemp = [];
var currentroadtemp = [];
var currentairhum = [];
var currentairtempprov = [];
var currentroadtempprov = [];
var datacoordinates =[];
var storedstation = [];
/**
 * Generats variables for the stations used as data for the current bar graphs. 
 * @param {*} typeofgraph A string which tells which data is sent in
 * @param {*} datatempvar This is the data used in graph later. temp, humidity etc
 * @param {*} stationame The station name
 */
function generatedataforbar(typeofgraph,datatempvar,stationame){
    var dataFirst = {
    label: stationame,
    backgroundColor: colornamelist[stationnamelist.indexOf(stationame)],
    borderColor: colornamelist[stationnamelist.indexOf(stationame)],
    data: [datatempvar]
  };
	if(typeofgraph=="current_air"){
		currentdatatemp.push(dataFirst);
	}
	if (typeofgraph=="current_road"){
		currentroadtemp.push(dataFirst);
	}
	if (typeofgraph=="current_hum"){
		currentairhum.push(dataFirst);
	}
	if (typeofgraph=="current_windspeed"){
		currentdatawind.push(dataFirst);
	}
	if (typeofgraph=="current_air_temp_county"){
		currentairtempprov.push(dataFirst);
	}
	if (typeofgraph=="current_road_temp_county"){
		currentroadtempprov.push(dataFirst);
	}	
	if (typeofgraph=="current_dagg_temp"){
		currentdaggpunkt.push(dataFirst);
	}
	/*if (typeofgraph=="current_accident_correlation"){
		accidentcorrelations.push(dataFirst);
	}*/
}
//test-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//generatedata test graph for accident da


var datacoordinates = [];
var dataaccipoint = [];
var storestation = [];
var storedcolors = [];
/**
 ** Collects data and send to generate function
 ** @param {*} weatherdata  Humidity data
 ** @param {*} station_name station name
 *
 * The for loop determains the data points which should be
 * ploted on the graph.
 * *
 * */
function datamultieplegrafaccidentcorrelation(weatherdata,station_name){

	var datacoordinates = [];
	var valuegraph = "accidentcorrelation";
	for(var i = 0; i < weatherdata.length; i++){
		datacoordinates.push({x:weatherdata[i].air_humidity, y:weatherdata[i].road_temperature, r:10});
	}
	var colorforline = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
	dataaccipoint.push(datacoordinates);
	storestation.push(station_name);
	storedcolors.push(colorforline);	
		
}


/************************************************
 *The job of accidentcorr function is 		*
 *to create the data with the values and	*
 *the designated color setting determained	*
 *earlyer and saved in datagrafacci.		*
 *						*
 * 						*
 ************************************************/

var lineChart6 = null;
//function to create accident bubble graph
/**
* This function will generate windspeed graph with the data in arrays generated from generatefuctions
 */
function accidentcorr(){

	if(lineChart6 != null){
		lineChart6.destroy();
 	}
	var speedCanvas = document.getElementById("myaccidentcorrelation").getContext('2d');
	Chart.defaults.global.defaultFontFamily = "Lato";
	Chart.defaults.global.defaultFontSize = 18;
		
 
	var chartOptions = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "accident", 
			},
			tooltip: {
				mode: 'point'
			}
		}
		
	};

	 	
		lineChart6 = new Chart(speedCanvas, {
			type: 'bubble',
			data: {
				datasets:
				(function (dataaccipoint) {
					var out = [];
				        for(var i=0; i<dataaccipoint.length; i++) {
						
						out.push({
							label: storestation[i],
							data: dataaccipoint[i],
							borderColor:storedcolors[i] ,
							backgroundColor: 'transparent' //colornamelist[stationnamelist.indexOf(stationame)],
						});
					}
					return out;
				 })(dataaccipoint)
				,
			},
			options: chartOptions
			
    		});
        	lineChart6.update();
	

}


                                                                 		                                      
//test--------------------------------------------------------------------------------------------------------------------------------------------------------------


//generatedataforcurrprov
/**
 * Collects data and send to generate function
 * @param {*} temp Latest average road temp from province
 * @param {*} id  id/name from province
 */
function databarchartcurrentprovroad(temp,id){
	var typeofgraph = "current_road_temp_county";
	var stationame = id;
	var datatempvar= temp;
	generatedataforbar(typeofgraph,datatempvar,stationame);
}
var chart11 = null;
/**
 * This function will generate graph with current average road temp for province with the data in arrays generated from generatefuctions
 */
function currentroadtempgraphprov(){
	if(chart11!=null){
		chart11.destroy();
	}
	var ctx = document.getElementById('myChart10').getContext('2d');
	chart11 = new Chart(ctx, {
	    type: 'bar',
	    data: {
		//labels: stations,
		datasets: currentroadtempprov
	    },

	
	    options: {
			title:{
	display:true,
	text: "Nuvarande medeltemperatur väg län"}
	}
	});
}
//current dagg temp
/**
 * Collects data and send to generate function
 * @param {*} data  The dewpoint temp
 * @param {*} station_name station name for the dewpoint
 */
function databarchartcurrentdagg(data,station_name){
	var typeofgraph = "current_dagg_temp";
	var stationame = station_name;
	var datatempvar= data;
	generatedataforbar(typeofgraph,datatempvar,stationame);
}

var chart15 = null;
/**
 * This function will generate current dew point graph with the data
 */
function currentdaggpunktfunc(){
	if(chart15!=null){
		chart15.destroy();
	}
	var ctx = document.getElementById('myChart12').getContext('2d');
	chart15 = new Chart(ctx, {
	    type: 'bar',
	    data: {
		//labels: stations,
		datasets: currentdaggpunkt
	    },

	    options: {
			title:{
	display:true,
	text: "Nuvarande daggpunkt(nuvarande temp>=0)"}
	}
	});
}


//current data air temp
/**
 * Collects data and send to generate function
 * @param {*} weatherdata This is the current air temp sent in
 * @param {*} station_name station name 
 */
function databarchartcurrent(weatherdata,station_name){
	var typeofgraph = "current_air";
	var stationame = station_name;
	var datatempvar= weatherdata[0].air_temperature;
        //var datatempvar= weatherdata.air_temperature;
	generatedataforbar(typeofgraph,datatempvar,stationame);
}

var chart = null;
/**
 * This function will generate current air temp graph with the data in arrays generated from generatefuctions
 */
function currenttempgraph(){
	if(chart!=null){
		chart.destroy();
	}
	var ctx = document.getElementById('myChart5').getContext('2d');
	chart = new Chart(ctx, {
	    type: 'bar',
	    data: {
		//labels: stations,
		datasets: currentdatatemp
	    },

	    options: {
			title:{
	display:true,
	text: "Nuvarande lufttemperatur"}
	}
	});
}


//current data windspeed 
/**
 * Collects data and send to generate function
 * @param {*} weatherdata This is the current windspeed data 
 * @param {*} station_name This is the stationame 
 */
function databarchartwindcurrent(weatherdata,station_name){
	var typeofgraph = "current_windspeed";
	var stationame = station_name;
	var datatempvar= weatherdata[0].wind_speed;
	//var datatempvar= weatherdata.wind_speed;
	generatedataforbar(typeofgraph,datatempvar,stationame);
}

var chart6 = null;
/**
 * This function will generate current windspeed graph with the data in arrays generated from generatefuctions
 */
function currentwindspeedgraph(){
	if(chart6!=null){
		chart6.destroy();
	}
	var ctx = document.getElementById('myChart8').getContext('2d');
	chart6 = new Chart(ctx, {
	    type: 'bar',
	    data: {
		//labels: stations,
		datasets: currentdatawind
	    },

	
	    options: {
			title:{
	display:true,
	text: "Nuvarande vindhastighet"}
	}
	});
}
//current data road temp
/**
 * Collects data and send to generate function
 * @param {*} weatherdata This is the current road temp
 * @param {*} station_name Station name 
 */
function databarchartroadcurrent(weatherdata,station_name){
	var typeofgraph = "current_road";
	var stationame = station_name;
	var datatempvar= weatherdata[0].road_temperature;
	//var datatempvar= weatherdata.road_temperature;
	generatedataforbar(typeofgraph,datatempvar,stationame);
}

var chart1 = null;
/**
 * This function will generate current road temp graph with the data in arrays generated from generatefuctions
 */
function currentroadtempgraph(){
	if(chart1!=null){
		chart1.destroy();
	}
	var ctx = document.getElementById('myChart6').getContext('2d');
	chart1 = new Chart(ctx, {
	    type: 'bar',
	    data: {
		//labels: stations,
		datasets: currentroadtemp
	    },

	
	    options: {
			title:{
	display:true,
	text: "Nuvarande vägtemperatur"}
	}
	});
}



//current data air humidity
/**
 * Collects data and send to generate function
 * @param {*} weatherdata Current humidity data
 * @param {*} station_name  station name
 */
function databarcharthumcurrent(weatherdata,station_name){
	var typeofgraph = "current_hum";
	var stationame = station_name;
	var datatempvar= weatherdata[0].air_humidity;
	//var datatempvar= weatherdata.air_humidity;
	generatedataforbar(typeofgraph,datatempvar,stationame);
}
var chart2 = null;
/**
 * This function will generate current humidity graph with the data in arrays generated from generatefuctions
 */
function currenthumgraph(){
	if(chart2!=null){
		chart2.destroy();
	}
	var ctx = document.getElementById('myChart7').getContext('2d');
	chart2 = new Chart(ctx, {
	    type: 'bar',
	    data: {
		//labels: stations,
		datasets: currentairhum
	    },

	
	    options: {
			title:{
	display:true,
	text: "Nuvarande luftfuktighet"}
	}
	});
}

//airtemp province avg
//multiple lines in the graph
var datagraftempprov = [];
var datagraftimestamptempprov = [];	
var datagraftimestamptempprovnotsliced = [];	
var checktruefalsetempprov=true;
/**
 * Collects data and send to generate function
 * @param {*} weatherdata data for average air temp for province 
 * @param {*} Prov_id the name for the province
 */
function datamultieplegraftempprov(weatherdata,Prov_id){
	
	var datagraftempprov = [];
	var valuegraph = "avgprovairtemp"
	var Prov_id = Prov_id;
	if (checktruefalsetempprov){
		for(var i = 0; i < weatherdata.length; i++){
			datagraftempprov.push(weatherdata[i].air_temperature);
			datagraftimestamptempprov.push(weatherdata[i].timestamp.slice(2,10)+" "+weatherdata[i].timestamp.slice(12,16));
			datagraftimestamptempprovnotsliced.push(weatherdata[i].timestamp);
		}
	}else{
		for(var i = 0; i < weatherdata.length; i++){
			var x = datagraftimestamptempprovnotsliced.indexOf(weatherdata[i].timestamp);
			var lastx;
			var offset;
			if(x>=0){
				datagraftempprov[x]=weatherdata[i].air_temperature;
				lastx = x;
				offset=0;
			}
			if(x==-1){
				offset++;
				datagraftempprov[lastx+offset]=weatherdata[i].air_temperature;
			}
			//datagraftempprov.push(weatherdata[i].air_temperature);
		}
	} 
	//console.log(datagraftempprov);
	checktruefalsetempprov=false;
	generatedata(valuegraph,datagraftempprov,Prov_id)

}



//wind_speed
//multiple lines in the graph
var datagrafwindspeed = [];
var datagraftimestampwindspeed = [];	
var checktruefalsewind=true;
/**
 * Collects data and send to generate function
 * @param {*} weatherdata  This is the windspeed data
 * @param {*} station_name station name
 */
function datamultieplegrafwinspeed(weatherdata,station_name){
	var datagrafwindspeed = [];
	var valuegraph = "windspeed"
	var stationame = station_name;
	for(var i = 0; i < weatherdata.length; i++){
		datagrafwindspeed.push(weatherdata[i].wind_speed);
	if(checktruefalsewind){
		datagraftimestampwindspeed.push(weatherdata[i].timestamp.slice(2,10)+" "+weatherdata[i].timestamp.slice(12,16));
	}
	}
	checktruefalsewind=false;
	generatedata(valuegraph,datagrafwindspeed,stationame)
}


//humidity
//multiple lines in the graph
var datagrafhum = [];
var datagraftimestamphum = [];	
var checktruefalsehum=true;
/**
 * Collects data and send to generate function
 * @param {*} weatherdata  Humidity data
 * @param {*} station_name station name
 */
function datamultieplegrafhumidity(weatherdata,station_name){
	var datagrafhum = [];
	var valuegraph = "humidity"
	var stationame = station_name;
	for(var i = 0; i < weatherdata.length; i++){
		datagrafhum.push(weatherdata[i].air_humidity);
		if(checktruefalsehum){
		datagraftimestamphum.push(weatherdata[i].timestamp.slice(2,10)+" "+weatherdata[i].timestamp.slice(12,16));
	}
	}
	checktruefalsehum=false;
	generatedata(valuegraph,datagrafhum,stationame)
}


//air_temp
//multiple lines in the graph
var datagrafair = [];
var datagraftimestampair = [];	
var checktruefalseair=true;
/**
 * Collects data and send to generate function
 * @param {*} weatherdata Air temp data
 * @param {*} station_name station name
 */
function datamultieplegrafair(weatherdata,station_name){
	var datagrafairtemp = [];
	var valuegraph = "airtemp"
	var stationame = station_name;
	for(var i = 0; i < weatherdata.length; i++){
		datagrafairtemp.push(weatherdata[i].air_temperature);
		if(checktruefalseair){
		datagraftimestampair.push(weatherdata[i].timestamp.slice(2,10)+" "+weatherdata[i].timestamp.slice(12,16));
	}
	}
	checktruefalseair=false;
	generatedata(valuegraph,datagrafairtemp,stationame);
}


//road_temp
//multiple lines in the graph
var data3graf3 = [];
var datagraftimestamp = [];
var checktruefalse=true;	
/**
 * Collects data and send to generate function
 * @param {*} weatherdata Road temp data
 * @param {*} station_name station name
 */
function datamultieplegraf(weatherdata,station_name){
	var datagrafroadtemp = [];
	var valuegraph = "roadtemp"
	var stationame = station_name;
	for(var i = 0; i < weatherdata.length; i++){
		datagrafroadtemp.push(weatherdata[i].road_temperature);
		if(checktruefalse){
			datagraftimestamp.push(weatherdata[i].timestamp.slice(2,10)+" "+weatherdata[i].timestamp.slice(12,16));
		}
	}
	checktruefalse=false;
	generatedata(valuegraph, datagrafroadtemp,stationame)
}


//Lists to match the color of the stations in the graphs
var stationnamelist = [];
var colornamelist = [];
/**
 * Generats variables for the stations used as data for the graphs. 
 * @param {*} value This specify which graph to generate data for like "roadtemp"
 * @param {*} datagraf This is the data for the graph
 * @param {*} stationame The station or province name
 */
function generatedata(value, datagraf, stationame){
    if(stationnamelist.includes(stationame)){
	    var dataFirst = {
	    label: stationame,
	    data: datagraf,
	    lineTension: 0.3,
	    fill: false,
	    borderColor: colornamelist[stationnamelist.indexOf(stationame)],
	    backgroundColor: 'transparent',
	    pointBorderColor: colorforline,
	    pointBackgroundColor: 'lightgreen',
	    pointRadius: 1,
	    pointHoverRadius: 5,
	    pointHitRadius: 2,
	    pointBorderWidth: 1,
	    pointStyle: 'rect'
  };
}
else{
    var colorforline = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
    stationnamelist.push(stationame);
    colornamelist.push(colorforline);
	    var dataFirst = {
	    label: stationame,
	    data: datagraf,
	    lineTension: 0.3,
	    fill: false,
	    borderColor: colorforline,
	    backgroundColor: 'transparent',
	    pointBorderColor: colorforline,
	    pointBackgroundColor: 'lightgreen',
	    pointRadius: 1,
	    pointHoverRadius: 5,
	    pointHitRadius: 2,
	    pointBorderWidth: 1,
	    pointStyle: 'rect'

};
}

	if(value=="roadtemp"){
		data3graf3.push(dataFirst);
	}
	if(value=="airtemp"){
		datagrafair.push(dataFirst);
	}
	if(value=="humidity"){
		datagrafhum.push(dataFirst);
	}
	if(value=="windspeed"){
		datagrafwindspeed.push(dataFirst);
	}
	if (value=="avgprovairtemp"){
		datagraftempprov.push(dataFirst);
	}
}


var lineChartptovair = null;
//function to create prov air temp avg graph
/**
 * This function will generate road temp province graph with the data in arrays generated from generatefuctions
 */
function roadtempprov(){
if(lineChartptovair!=null){
	lineChartptovair.destroy();
}

var speedCanvas = document.getElementById("myChart11");
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;


var speedData = {
  labels: datagraftimestamptempprov,
  datasets: datagraftempprov
};

var chartOptions = {
    scales: {
        xAxes: [{
            ticks: {
                fontSize: 15
            }
        }]
    },
    title:{
	display:true,
	text: "Vägtemperatur medel län",
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black',
    }
}
  }
};

lineChartptovair = new Chart(speedCanvas, {
  type: 'line',
  data: speedData,
  options: chartOptions
});
lineChartptovair.update();
}

var lineChart1 = null;
//function to create road_temp graph
/**
 * This function will generate road temp graph with the data in arrays generated from generatefuctions
 */
function roadtemp(){
if(lineChart1!=null){
lineChart1.destroy();
}

var speedCanvas = document.getElementById("myChart2");
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;



var speedData = {
  labels: datagraftimestamp,
  datasets: data3graf3
};

var chartOptions = {
    scales: {
        xAxes: [{
            ticks: {
                fontSize: 15
            }
        }]
    },
    title:{
	display:true,
	text: "Vägtemperatur",
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black'
    }
}
  }
};

lineChart1 = new Chart(speedCanvas, {
  type: 'line',
  data: speedData,
  options: chartOptions
});
lineChart1.update();
}


var lineChart2 = null;
//function to create air_temp graph
/**
 * This function will generate air temp graph with the data in arrays generated from generatefuctions
 */
function airtemp(){
if(lineChart2 != null){
lineChart2.destroy();
}
var speedCanvas = document.getElementById("myChart1");
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;



var speedData = {
  labels: datagraftimestampair,
  datasets: datagrafair
};

var chartOptions = {
    scales: {
        xAxes: [{
            ticks: {
                fontSize: 15
            }
        }]
    },
    title:{
	display:true,
	text: "Lufttemperatur",
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black',
    }
}

  }


};

lineChart2 = new Chart(speedCanvas, {
  type: 'line',
  data: speedData,
  options: chartOptions
});
lineChart2.update();
}

var lineChart3 = null;
//function to create humidity graph
/**
 * This function will generate humidity graph with the data in arrays generated from generatefuctions
 */
function humiditygraph(){
if(lineChart3 != null){
lineChart3.destroy();
}
var speedCanvas = document.getElementById("myChart3");
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;



var speedData = {
  labels: datagraftimestamphum,
  datasets: datagrafhum
};

var chartOptions = {
    scales: {
        xAxes: [{
            ticks: {
                fontSize: 15
            }
        }]
    },
    title:{
	display:true,
	text: "Luftfuktighet",
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black'
    }
}
  }
};

lineChart3 = new Chart(speedCanvas, {
  type: 'line',
  data: speedData,
  options: chartOptions
});
lineChart3.update();
}

var lineChart4 = null;
//function to create windspeed graph
/**
 * This function will generate windspeed graph with the data in arrays generated from generatefuctions
 */
function windspeed(){
if(lineChart4 != null){
lineChart4.destroy();
}
var speedCanvas = document.getElementById("myChart4");
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;



var speedData = {
  labels: datagraftimestampwindspeed,
  datasets: datagrafwindspeed
};

var chartOptions = {
    scales: {
        xAxes: [{
            ticks: {
                fontSize: 15
            }
        }]
    },
    title:{
	display:true,
	text: "Vindhastighet",
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black'
    }
}
  }
};

lineChart4 = new Chart(speedCanvas, {
  type: 'line',
  data: speedData,
  options: chartOptions
});
lineChart4.update();
}

/*
(f/100)^(1/8)*(112+0.9T)+0.1T-112
*/
/**
 * Takes data from current temp and current humidity and calculates the dew point for that station.
 * Only works if current temp is bigger than or equal to 0
 */
function daggpunktfunc(){
	var dagg;
	for(var i=0;i<currentdatatemp.length;i++){
		if(currentdatatemp[i].data[0]>=0){
			dagg = Math.pow((currentairhum[i].data[0]/100), (1/8)) *(112+(0.9*currentdatatemp[i].data[0]))+(0.1*currentdatatemp[i].data[0])-112;
			databarchartcurrentdagg(dagg,currentdatatemp[i].label);
		}
	}
}

/* FRICTION SECTION */

var currentdatafriction = [];
/**
 * 
 * @param {*} datatempvar Data to be put into the datafirst variable used to show it in the graph
 */
function generatedataforbarfriction(datatempvar,frictionid){
	var colorforbar = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
    var dataFirst = {
    label: frictionid,
    backgroundColor: colorforbar,
    borderColor: colorforbar,
    data: [datatempvar]
  };
  currentdatafriction.push(dataFirst);
	

}
/**
 * Collects data and send to generate function
 * @param {*} frictiondata This is the current frictiondata sent in
 */
function databarchartfrictiondata(frictiondata){
	var datatempvar = frictiondata[0].MeasurementValue;
	var frictionid = frictiondata[0].id;
	generatedataforbarfriction(datatempvar,frictionid);
}

var chartFrictionCurrent = null;
/**
 * This function will generate current air temp graph with the data in arrays generated from generatefuctions
 */
function currentfrictiongraph(){
	if(chartFrictionCurrent!=null){
		chartFrictionCurrent.destroy();
	}
	var ctx = document.getElementById('myChartCurrentFriction').getContext('2d');
	chartFrictionCurrent = new Chart(ctx, {
	    type: 'bar',
	    data: {
		//labels: stations,
		datasets: currentdatafriction
	    },

	    options: {
			title:{
	display:true,
	text: "Nuvarande vägmätningar"}
	}
	});
}


var datafrictiongraf = [];
var datagrafrictiontimestamp = [];	
/**
 * Collects data and send to generate function
 * @param {*} frictiondata frictiondata 
 */
function datamultieplegraffriction(frictiondata){
	var datagraffriction = [];
	for(var i = 0; i < frictiondata.length; i++){
		datagraffriction.push(frictiondata[i].MeasurementValue);
		datagrafrictiontimestamp.push(frictiondata[i].MeasureTimeUTC.slice(2,10)+" "+frictiondata[i].MeasureTimeUTC.slice(11,16));
	}
	checktruefalse=false;
	generatedataFriction(datagraffriction)
}

function generatedataFriction(datagraf){
		var colorforline = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
		var dataFirst = {
			label: "Friktionsvärde",
			data: datagraf,
			lineTension: 0.3,
			fill: false,
			borderColor: colorforline,
			backgroundColor: 'transparent',
			pointBorderColor: colorforline,
			pointBackgroundColor: 'lightgreen',
			pointRadius: 1,
			pointHoverRadius: 5,
			pointHitRadius: 2,
			pointBorderWidth: 1,
			pointStyle: 'rect'
		};

		datafrictiongraf.push(dataFirst);

}


var lineChartfriction1 = null;
//function to create air_temp graph
/**
 * This function will generate air temp graph with the data in arrays generated from generatefuctions
 */
function frictiondata(){
if(lineChartfriction1 != null){
	lineChartfriction1.destroy();
}
var speedCanvas = document.getElementById("myChartFriction");
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;



var speedData = {
  labels: datagrafrictiontimestamp, 
  datasets: datafrictiongraf 
};

var chartOptions = {
    scales: {
        xAxes: [{
            ticks: {
                fontSize: 15
            }
        }]
    },
    title:{
	display:true,
	text: "Vägmätningar",
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black',
    }
}

  }


};

lineChartfriction1 = new Chart(speedCanvas, {
  type: 'line',
  data: speedData,
  options: chartOptions
});
lineChartfriction1.update();
}




//clear all the arrays
/**
 * This will clear all the arrays and set the booleans to true
 */
function cleararrays(){
	currentdatatemp = [];
	datagrafwindspeed = [];
	datagraftimestampwindspeed = [];
	currentairtempprov = [];
	currentroadtempprov = [];
	datacoordinates = [];
	datagrafhum = [];
	datagraftimestamphum = [];	
	datagrafair = [];
	datagraftimestampair = [];
	data3graf3 = [];
	datagraftimestamp = [];	
	dataaccipoint=[];
 	currentroadtemp = [];
	currentairhum = [];	
	currentdatawind = [];
	checktruefalse=true;
	checktruefalseair=true;
	checktruefalsehum=true;
	checktruefalsewind=true;
	datagraftempprov = [];
    datagraftimestamptempprov = [];	
	datagraftimestamptempprovnotsliced = [];
	checktruefalsetempprov=true;
	currentdaggpunkt = []
	datafrictiongraf = [];
	datagrafrictiontimestamp = [];	
	storestation = [];
	storedcolors = [];
}


