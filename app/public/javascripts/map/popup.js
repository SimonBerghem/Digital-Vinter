/**
 * Creates and returns the popup content for a station marker.
 * @param {*} station a station data JSON object.
 * @param {*} marker a Leaflet marker representing a specific station.
 */
var accidentPrecipitation;
var accidentRoadTemp;
var accidentHumidity;
var accidentStation;
function addPopup(station, marker,cameraArrayData) {
  let cameraurl = "";
  let cameraurlbig ="";
  let timestampcamera = "";
 for(var i=0;i<cameraArrayData.length;i++){
  if(cameraArrayData[i].station_id == station.id){
    cameraurl = cameraArrayData[i].url_thumb;
    timestampcamera =  cameraArrayData[i].time;
    cameraurlbig = cameraArrayData[i].url;
  }
 }
  let popupContent = document.createElement("table-data");

  let index = getLatestWeatherIndex(station);
  
  if(index == -1){
    console.log("ERROR");
  }else{

    
var obj = {
  Station: [station.name,""],
  Län: [countyNames[station.county_number],""],
  Lufttemperatur: [latestWeatherData[index]['air_temperature'],"\xB0C"],
  Vägtemperatur: [latestWeatherData[index]['road_temperature'],"\xB0C"],
  Luftfuktighet: [latestWeatherData[index]['air_humidity'],"%"],
  Nederbördstyp: [latestWeatherData[index]['precipitation_type'],""],
  Nederbördsmängd: [latestWeatherData[index]['precipitation_millimetres'] ," mm"],
  Vindhastighet: [latestWeatherData[index]['wind_speed']," m/s"],
  Vindriktning: [windDirection(latestWeatherData[index]['wind_direction']),""],
  Tidväderdata: [latestWeatherData[index]['timestamp'],""],
  Tidkamera: [timestampcamera,""]
};
  var strings = "";
  Object.keys(obj).forEach(function(key){
    if(obj[key][0] != null){
      if(obj[key][0] == "rain") {
        marker.setIcon(rainIcon);
      }
      if(obj[key[0] == "snow"]) {
        marker.setIcon(snowIcon);
      }
      strings+='<tr> <td>'+ key +'</td> <td>'+ obj[key][0] + obj[key][1] +'</td> </tr>'
    }
  });

    var htmlvar = '<table id = "marker-data" >' +strings + '</table>'
    strings = "" 

    popupContent.innerHTML  = htmlvar;

  }

  if(cameraurl!="" && cameraurl != null && cameraurl != undefined){

    let image =  document.createElement("IMG");
    image.src = cameraurl;
    image.className ="imageclasspopup";
    image.onclick = function() {
      window.open(cameraurlbig, '_blank');
    };
    popupContent.appendChild(image);
    cameraurl="";

  }

  // Leaflet require DOM therefor Jquery is not used
  let button = document.createElement("button");
  button.id = station.id;
  if(chosenStations.includes(station)){
    button.className = "remove-button";
    button.innerText = "Ta bort";
  }else{
    button.className = "add-button";
    button.innerText = "Lägg till";
  }
  
  button.addEventListener("click" , function() {
        handleChosenStations(station, marker, this);
    
  });
  popupContent.appendChild(button);



  return popupContent;
}
/**
 * 
 * @param {*} friction return popup content for frictiondata circlemarkers
 */
function popupfriction(friction, circle){
   const popupContent = document.createElement("table-data");
    
    // Tar bort oönskade element i strängen.
   const timestring = friction.ObservationTimeUTC.replace("T", " / ").replace("Z", " ");

  var obj = {
    Mätvärde  : [friction.MeasureValue,""],
    Tid  : [timestring,""],
    Latitude  : [friction.Latitude,""],
    Longitud  : [friction.Longitude,""],
    Konfidensintervall: [friction.MeasureConfidence,""],
      
  };
  var strings = "";
  Object.keys(obj).forEach(function(key){
    if(obj[key][0] != null){
      strings+='<tr> <td>'+ key +'</td> <td> &nbsp '+ obj[key][0] + obj[key][1] +'</td> </tr> '
    }
  });

  var htmlvar = '<table id = "marker-data" >' +strings + '</table>'
  strings = ""    

  popupContent.innerHTML  = htmlvar;

  let button = document.createElement("button");
  button.id = friction.id;
  if(chosenFriction.includes(friction)){
    button.className = "remove-button";
    button.innerText = "Ta bort";
  }else{
    button.className = "add-button";
    button.innerText = "Lägg till";
  }
  button.addEventListener("click" , function() {
        handleChosenFriction(friction, circle, this);
  });
  popupContent.appendChild(button);

  return popupContent;
}

function popupAccident(accident, circle){
/* Används för att öka mängden info som visas i popups för olyckor, oidentifierat fel någonstans så används ej
  let str = accident.WGS84;
  let longitude = parseFloat(str.split(" ")[1].split("(")[1]);
  let latitude = parseFloat(str.split(" ")[2].split("(")[0]);
  let countyNum = accident.CountyNo;
  let accidentTime = accident.CreationTime;
  await $.getJSON("/api/getAccidentStation",{longitude, latitude, countyNum}, function(accidentStat){
	console.log(accidentStat);
	accidentStation = accidentStat[0]["stationID"];
  });
  await $.getJSON("/api/getAccidentWeatherStationData",{accidentTime, accidentStation}, function(accidentWeather){
	console.log(accidentWeather);
	accidentPrecipitation = accidentWeather[0]["precipitation_type"];
        accidentRoadTemp = accidentWeather[0]["road_temperature"];
        accidentHumidity = accidentWeather[0]["air_humidity"];
  });
*/
  const popupContent = document.createElement("table-data");

  var obj = {
    StartTime : [accident.CreationTime.replace("T", " / ").replace("Z", " "), ""],
    EndTime : [accident.EndTime.replace("T", " / ").replace("Z", " "), ""],
    Severity : [accident.SeverityCode,""],
    AccidentType: [accident.IconId, ""],
/*    AccidentPrecipitation: [accidentPrecipitation, ""],
    AccidentRoadtemperature: [accidentRoadTemp, ""],
    AccidentHumidity: [accidentHumidity, ""],*/
  };

  var strings = "";
 Object.keys(obj).forEach(function(key){
   if(obj[key][0] != null){
     strings+='<tr> <td>'+ key +'</td> <td> &nbsp '+ obj[key][0] + obj[key][1] +'</td> </tr> '
   }
 });

 var htmlvar = '<table id = "marker-data" >' +strings + '</table>'
 strings = ""

 popupContent.innerHTML  = htmlvar;

 return popupContent;
}

/**
 * 
 * @param {*} friction return popup content for aggregated frictiondata circlemarkers
 */
function popupAggregatedFriction(friction, notAggregated){
  const popupContent = document.createElement("table-data");
  let timestring
  let obj
   
   // Separate logic depending on if we want to display aggregated friction data or not
  if(notAggregated) {
    // Tar bort oönskade element i strängen.
    timestring = friction.ObservationTimeUTC.replace("T", " / ").replace("Z", " ");
    obj = {
      Mätvärde  : [friction.MeasureValue,""],
      Tid  : [timestring,""],
      Latitude  : [friction.latitude,""],
      Longitud  : [friction.longitude,""],
      Konfidens: [friction.MeasureConfidence,""],
    };
  } else {
    // Tar bort oönskade element i strängen.
    timestring = friction.time.replace("T", " / ").replace("Z", " ");
    obj = {
      AggregationsRadie : [friction.distance, ""],
      AggregationsTid : [TIMEAGGREGATIONENUM[friction.timeAggregation], ""],
      MätvärdeMedian  : [friction.measureValueMedian,""],
      MätvärdeMax  : [friction.measureValueMax,""],
      MätvärdeMin  : [friction.measureValueMin,""],
      Tid  : [timestring,""],
      Latitude  : [friction.latitude,""],
      Longitud  : [friction.longitude,""],
      KonfidensMedian: [friction.measureConfidenceMedian,""],
      KonfidensMax: [friction.measureConfidenceMax,""],
      KonfidensMin: [friction.measureConfidenceMin,""],
      AggregeradePunkter: [friction.nrOfAddedPoints,""],
        
    };
  }
  
 var strings = "";
 Object.keys(obj).forEach(function(key){
   if(obj[key][0] != null){
     strings+='<tr> <td>'+ key +'</td> <td> &nbsp '+ obj[key][0] + obj[key][1] +'</td> </tr> '
   }
 });

 var htmlvar = '<table id = "marker-data" >' +strings + '</table>'
 strings = ""    

 popupContent.innerHTML  = htmlvar;

 /* let button = document.createElement("button");
 button.id = friction.id;
 if(chosenFriction.includes(friction)){
   button.className = "remove-button";
   button.innerText = "Ta bort";
 }else{
   button.className = "add-button";
   button.innerText = "Lägg till";
 } */
 /* button.addEventListener("click" , function() {
       handleChosenFriction(friction, circle, this);
 }); */
 /* popupContent.appendChild(button); */

 return popupContent;
}


function windDirection(data) {
    if(data == 'north') {
      return '&nbsp; <i class="fas fa-long-arrow-alt-down fa-2x"></i> <br>';
    }
    else if(data == 'south') {
      return '&nbsp; <i class="fas fa-long-arrow-alt-up fa-2x"></i> <br>';
    }
    else if(data == 'east') {
      return '&nbsp; <i class="fas fa-long-arrow-alt-left fa-2x"></i> <br>';
    }
    else if(data == 'west') {
      return '&nbsp; <i class="fas fa-long-arrow-alt-right fa-2x"></i> <br>';
    }
    else if(data == 'northEast') { //southWest
      return '&nbsp; <i class="fas fa-long-arrow-alt-down fa-2x" style="transform: rotate(45deg)"></i> <br>';
    }
    else if(data == 'northWest') { //southEast
      return '&nbsp; <i class="fas fa-long-arrow-alt-right fa-2x" style="transform: rotate(45deg)"></i> <br>';
    }
    else if(data == 'southEast') { //northWest
      return '&nbsp; <i class="fas fa-long-arrow-alt-up fa-2x" style="transform: rotate(45deg)"></i> <br>';
    }
    else if(data == 'southWest') { //northEast
      return '&nbsp; <i class="fas fa-long-arrow-alt-left fa-2x" style="transform: rotate(45deg)"></i> <br>';
    }
}

/**
 * Use this method to get a specific index from the latestWeatherdata array based on a specific station.
 * @param {*} station a station data JSON object.
 */
function getLatestWeatherIndex(station){
  for(let j = 0; j < latestWeatherData.length; j++){
      if(station.id === latestWeatherData[j].station_id){
          return j;
      }
  } 
  return -1;
}
