let countyDrawn = 0;
let roadDrawn = 0;
let noColor = false;
/**
 * The default map tiles.
 */
const mapboxURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYnVnbWFuYSIsImEiOiJjanJhbXVqbmowcmQzNDRuMHZhdzNxbjkxIn0.x1rFh-zIo8WfBRfpj2HsjA';

/**
 * The default tile layer for the map.
 */
const standardTileLayer = L.TileLayer.boundaryCanvas(mapboxURL, {
    maxZoom: 15,
    minZoom: 5,
    maxBoundsViscosity: 1.0,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
    // boundary: countyData
});

/**
 * Sets the css style for the county map based on county average temperature.
 * @param {*} feature a GeoJSON feature
 */
function countyStyle(feature) {
    let avg = averageData[feature.properties.countyCode];
    return {
        weight: 2,
        opacity: 0.2,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.7,
        fillColor: getColor(avg[1])
    };
}

/**
 * Adds the Swedish countys to the map with some css styling.
 */
function drawMap() {
    if(roadDrawn == 1) {
        map.removeLayer(roadTileLayer);
        map.removeLayer(geojson);
        roadDrawn = 0;
    }
    if(countyDrawn == 0) {
        standardTileLayer.addTo(map);
        geojson = L.geoJson(countyData, {
            style: countyStyle,
            onEachFeature: onEachFeature
        }).addTo(map);
        countyDrawn = 1;
    }
}

/**
 * Map tiles with more defined roads.
 */
const swedenRoads = 'http://{s}.tile.openstreetmap.se/osm/{z}/{x}/{y}.png';

/**
 * The road tile layer with more defined roads.
 */
const roadTileLayer = L.TileLayer.boundaryCanvas(swedenRoads, {
    maxZoom: 15,
    minZoom: 5,
    maxBoundsViscosity: 1.0,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets',
    //boundary: countyData
});

/**
 * Sets the css style depending on average road temperature
 * @param {*} feature a GeoJSON feature
 */
function roadStyle(feature) {
    let avg = averageData[feature.properties.countyCode];
    return {
        weight: 2,
        opacity: 0.2,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(avg[2])
    };
}

/**
 * Redraw the map to road mode.
 */
function drawRoads(){
    if(countyDrawn == 1) {
        map.removeLayer(geojson);
        map.removeLayer(standardTileLayer);
        countyDrawn = 0;
    }
    if(roadDrawn == 0) {
        roadTileLayer.addTo(map);
        geojson = L.geoJson(countyData, {
            style: roadStyle,
            onEachFeature: onEachFeature
        }).addTo(map);
        roadDrawn = 1;
    }
}

function drawFriction(filteredfrictionData) {
    for (let i = 0; i < layerGroups.length; i++) {
        map.removeLayer(layerGroups[i]);

    }
    layerGroups = [];
    createFrictionLayer(filteredfrictionData);
}

/**
 * Modifies the county polyline css.
 * @param {*} event the triggered event from user input.
 */
function highlightFeature(event) {
    if(noColor == false) {
        let layer = event.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        info.update(layer.feature.properties);
    }else {
        let layer = event.target;
        layer.setStyle({
        weight: 2,
        color: 'black',
        dashArray: '',
        fillOpacity: 0
        });
    info.update(layer.feature.properties);
    }
}

/**
 * This function is called when a user clicks on a county. Creates a new popup with county info and average weather data. A button to add the county is present.
 * @param {*} event the triggered event on click.
 */
function createCountyPopup(event) {
    let layer = event.target;
    let countyCode = layer.feature.properties.countyCode;
    let avg = averageData[countyCode];
    let popLocation= event.latlng;
    let chosenCountyExists = false;
    let popup = L.popup();
    popup.setLatLng(popLocation);
    let button = document.createElement("div");
    let popupContent = document.createElement("table-data");
    popupContent.innerHTML  = '<table id = "county-data" >' +
    '<tr> <td> Län: </td><td>' + countyNames[avg[0]] + '</td></tr>' + 
    '<tr> <td>Lufttemperatur: </td><td>' + avg[1].toFixed(1)+ '\xB0C' + '</td></tr>' +
    '<tr> <td>Vägtemperatur: </td><td>' + avg[2].toFixed(1)+ '\xB0C' + '</td></tr>' +
    '</table>';


    for(let i = 0; i < chosenCounties.length; i++) {
        if(chosenCounties[i] === countyCode) {
            button.innerText = "Ta bort";
            button.className = "remove-button"; 
            chosenCountyExists = true;  
        }
    }
    if(!chosenCountyExists) {
        button.className = "add-button";
        button.innerText = "Lägg till";
    }
    
    
    button.addEventListener("click" , function() {
        if(chosenCountyExists == true) {
            removeCounty(countyCode, button); 
            map.closePopup();     
        }else {
            addChosenCounty(countyCode, popLocation, button);
            map.closePopup();
        }
    });

    popupContent.appendChild(button);
    popup.setContent(popupContent);
    popup.openOn(map);

}

/**
 * Resets the county polyline css to default.
 * @param {*} event when the county is not longer hovered.
 */
function resetHighlight(event) {
    if(noColor == false) {
        info.update();
        geojson.resetStyle(event.target);

    }else {
        info.update();
        }
    }

/**
 * Enables mouse hover and click events to a specific GeoJSON feature on a specific layer.
 * @param {*} feature a GeoJSON feature.
 * @param {*} layer a leaflet layer element.
 */
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: createCountyPopup
    });
}

/**
 * This button will change the tile layer on click.
 */
const mapChangingButton = L.easyButton({
    states: 
    [
        {
            stateName: 'Countymap',        
            icon:      'fas fa-sun',               
            title:     'Länöversikt lufttemperatur',      
            onClick: function(btn, map) { 
                btn.state('Roadmap');
                stateChangingButton.state('Ta-bort-färgmarkering');
                noColor = false;     
                drawRoads();
            }
        }, 
        {
            stateName: 'Roadmap',
            icon:      'fas fa-road',
            title:     'Länöversikt vägtemperatur',
            onClick: function(btn, map) {
                btn.state('Countymap');
                stateChangingButton.state('Ta-bort-färgmarkering');
                noColor = false;
                drawMap();
            }
        }
    ]
}).addTo(map);

/**
 * This button will change the county color state on click.
 */
const stateChangingButton = L.easyButton({
    states: 
    [
        {
            stateName: 'Ta-bort-färgmarkering',        
            icon:      'fas fa-toggle-off',               
            title:     'Ta bort färmarkering',      
            onClick: function(btn, map) {      
                btn.state('Lägg-till-färgmarkering');    
                geojson.eachLayer(function (layer) {    
                     layer.setStyle({fillOpacity :0 }) 
                     noColor = true;
                });
            }
        }, 
        {
            stateName: 'Lägg-till-färgmarkering',
            icon:      'fas fa-toggle-on',
            title:     'Lägg till färgmarkering',
            onClick: function(btn, map) {
                btn.state('Ta-bort-färgmarkering');
                geojson.eachLayer(function (layer) {    
                    layer.setStyle({fillOpacity : 0.7 }) 
                    noColor = false;
               });
            }
        }
    ]
}).addTo(map);

const modalButton = L.easyButton('fas fa-upload', function(btn, map) {
    $('#exampleModal').modal('show');
}, 'Ladda upp ny friktionsdata').addTo(map);

const toggleFriction = L.control({position: 'topleft'});


/**
 * This is wrapped around a function because it is called when the data is fetched from the databases so it loaded at the same time
 * @param {*} data distinct reportorgs from friction_data;
 */
function addtoMAPtoggle(data){
    let stringreport = '<select><option>WeatherStationData</option>'
    for(var i=0; i<data.length; i++){
        stringreport += '<option>'+data[i].reporterorganisation+'</option>';
    }
    stringreport += '</select>';

    toggleFriction.onAdd = function (map) {
       var div = L.DomUtil.create('div');
       //div.innerHTML = '<select><option>WeatherStationData</option><option>RoadCloud</option><option>Volvo Cars</option><option>NIRA Dynamics</option></select>';
       div.innerHTML = stringreport;
       div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
       return div;
    };
    toggleFriction.addTo(map);

    $('select').change(function(){
        $('select option:selected').each(function(){
            if($(this).text()=="WeatherStationData"){
                geojson.eachLayer(function (layer) {    
                    layer.setStyle({fillOpacity : 0.7 }) 
                    noColor = false;
               });
                info.addTo(map);
                //temperatureScale.addTo(map);
                $( "#search-container" ).show();
                circleGroup = [];
                createLayers(stationsData,cameraArrayData);
            }
            else{
                getFrictionData($(this).text());
            }
        });
    });
}


