/**
 * This function wil clear the arrays in graph.js.
 * It will then call the functions in GetWeatherData.js to get the data from API.
 * The data will be generated and after this is done we call the functions that will draw the graphs.
 * Which graphs will be generated depends on what is chosen in map-module
 * @param {*} starttime Start time to know which intervall to get data from
 * @param {*} stoptime Stop time to know which intervall to get data from
 */
async function rungraphs(starttime, stoptime){
    var a = new Date(starttime.substring(0,10)+"T"+starttime.substring(11,)+"Z");
    var b = new Date(stoptime.substring(0,10)+"T"+stoptime.substring(11,)+"Z");
    if(+a < +b){
    //arrayclear
    await cleararrays();
	
    //canvasclear
    for(var i=0;i<canvaschartidarray.length;i++){
      clearcanvasfunc(canvaschartidarray[i]);
    }
  

    //functioncalls to get data

    if(frictionarrayid.length > 0){
      await getLatestFrictionData(frictionarrayid);
    }
    if(boundscircle.length > 0 && layerGroups.length == 0){
      let lat = boundscircle[0]._latlng.lat;
      let lon = boundscircle[0]._latlng.lng;
      let radius = boundscircle[0]._mRadius;
      await getFrictionDataCirc(frictiondatafrommap[0].ReporterOrganization,lat,lon,radius);
    }

    if(boundsrect.length >0 && layerGroups.length == 0){
      let NElat = boundsrect[0]._bounds._northEast.lat;
      let NElon = boundsrect[0]._bounds._northEast.lng;
      let SWlat = boundsrect[0]._bounds._southWest.lat;
      let SWlon = boundsrect[0]._bounds._southWest.lng;
      await getFrictionDataRect(frictiondatafrommap[0].ReporterOrganization, SWlat, NElat, SWlon, NElon);
    }
    if(stationsarrayid.length>0){
      await getWeatherData(stationsarrayid,starttime,stoptime,stationname);
      await getlatest(stationsarrayid,stationname);
    }
    if(chosenintcounties.length>0){
      await getAverageTempProvince(chosenintcounties,starttime,stoptime);
      await getLatestAvgCountyWeatherData(chosenCounties);
    }

    if(stationsarrayid.length>0){
      //functions to draw graphs
      await roadtemp();

      await airtemp();

      await humiditygraph();

      await windspeed();

      await currenttempgraph();

      await currentroadtempgraph();

      await currenthumgraph();

      await currentwindspeedgraph();

      await daggpunktfunc();
      await currentdaggpunktfunc();
      //Test----------------------------------------------------------------------------------
      await currentaccidentcorrelation();
      //--------------------------------------------------------------------------------------
      show1("hidebut");
    }

    if(chosenintcounties.length>0){
      await roadtempprov()

      await currentairtempgraphprov();

      await currentroadtempgraphprov();
      show1("province");
    }
    if(boundsrect.length >0 || boundscircle.length >0){
      await frictiondata();
      show1("frictionbuttoncanvas");
    }
    if(frictionarrayid.length >0){
      await currentfrictiongraph();
      show1("frictionbuttoncanvascurrent");
    }

  }
}

/**
 * 
 * @param {*} canvaschart This is the canvas id from graphs.ejs. Used to clear the canvas.
 */
function clearcanvasfunc(canvaschart){
  const canvasclearvar1 = document.getElementById(canvaschart).getContext('2d');
  canvasclearvar1.clearRect(0,0, document.getElementById(canvaschart).width, document.getElementById(canvaschart).height);
}

/**
 * 
 * @param {*} timestamp Timestmap from an array in graphs for the csv file
 * @param {*} data  Data such as temp, windspeed etc from an array in graphs for the csv file
 */
function CSVdownload(timestamp,data){
    var rows = [];
    let temparray = [];
    let temparrayfirst = ["Timestamp"];
    for(var y = 0; y < data.length;y++){
      temparrayfirst.push(data[y].label);
    }
    rows.push(temparrayfirst);
    temparrayfirst = ["Timestamp"];
    
    for(var i = 0; i<timestamp.length;i++){
        temparray.push(timestamp[i]);
        for(var x = 0; x < data.length;x++){
          temparray.push(data[x].data[i]);
      }
      rows.push(temparray);
      temparray=[];
    }
    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach(function(rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
  });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
  }
