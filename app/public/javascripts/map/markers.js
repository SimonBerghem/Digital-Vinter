/**
 * The default icon for a station marker.
 */
const icon = L.divIcon({
    className: 'fas fa-map-pin fa-2x',
    iconAnchor: [12, 24],
    popupAnchor: [-5, -25],
});

const frictionIcon = L.divIcon({
    className: 'fas fa-road',
    iconAnchor: [12, 24],
    popupAnchor: [-5, -25],
});
/**
 * The station marker icon when a station is chosen.
 */
const selectedIcon = L.divIcon({
    className: 'fas fa-check-circle fa-2x',
    iconAnchor: [16, 23],
    popupAnchor: [-5, -35]
});

const rainIcon = L.divIcon({
    className: 'fas fa-umbrella fa-2x',
    iconAnchor: [16, 24],
    popupAnchor: [-4, -30]

});
const snowIcon = L.divIcon({
    className: 'far fa-snowflake fa-2x',
    iconAnchor: [12, 24],
    popupAnchor: [-5, -25]

});

/**
 * Adds station markers to the map based on the zoom level.
 * @param {*} group a Leaflet layer group with markers.
 */
function addMarkerOnZoom(group){
    if(layerGroups.length != 0) {
        for(var i = 0; i <= group; i++){
            if(!map.hasLayer(layerGroups[i])){
                if(map.getZoom() < 10){
                    map.addLayer(layerGroups[i]);
                }
            }
        }
    }
}

/**
 * Removes station markers from the map based on the zoom level.
 * @param {*} group a Leaflet layer group with markers.
 */
function removeMarkerOnZoom(group){
    if(layerGroups.length != 0) {
        for(var i = 9; i > group; i--){
            if(map.hasLayer(layerGroups[i])){
                if(map.getZoom() < 10){
                    map.removeLayer(layerGroups[i]);
                }
            }
        }
    }
}

/**
 * Should contain layergroups of markers.
 */

var layerGroups = [];
var circleGroup = [];
let frictionCanvas = L.canvas({ padding: 0.5, pane: "circlemarkers", });
//let frictionCanvas = new L.layerGroup();

function createFrictionLayer(filteredfrictionData) {
    circleGroup = [];
    map.removeLayer(frictionCanvas);
    frictionCanvas = L.canvas({ padding: 0.5, pane: "circlemarkers", });
    //frictionCanvas.clearLayers();

    for (var i = 0; i < filteredfrictionData.length; i += 1) { 
        let circle = L.circleMarker([filteredfrictionData[i].Latitude, filteredfrictionData[i].Longitude], {
        renderer: frictionCanvas,
        color: '#0a7bf5'
        });
        circle.bindPopup(popupfriction(filteredfrictionData[i], circle));
        circleGroup.push(circle);
        circle.addTo(map);
        
    }


    //Det är här för att det ska ladda snyggare. Motsvarande för att sätta igång är i maptilelayers.js i början av funktionen.
    geojson.eachLayer(function (layer) {    
        layer.setStyle({fillOpacity :0 }) 
        noColor = true;
    });

    info.remove(map);
    //temperatureScale.remove(map);
    $( "#search-container" ).hide();
}

/**
 * Adds a station to a specific layer group.
 * @param {*} station a station data JSON object.
 * @param {*} layerNumber specifies in what layer group the station belongs to.
 */
function addStationToLayer(station, layerNumber,cameraArrayData){
    const id = "marker"+station.id;
    var marker = L.marker([station.lat, station.lon],{myCustomId: id});
    marker.setIcon(icon);

    if(!layerGroups[layerNumber]) {
        layerGroups[layerNumber] = new L.layerGroup();
    }

    layerGroups[layerNumber].addLayer(marker);    
    marker.bindPopup(addPopup(station,marker,cameraArrayData));
    marker.on('click', function(){
        if(marker.getPopup().isOpen()){
            marker.getPopup().setContent(addPopup(station,marker,cameraArrayData));
            this.openPopup();
        }else{
            map.closePopup();
        }
    });
}

/**
 * Use this method to create the group layers that contains markers.
 * @param {*} stations station data JSON array.
 */
function createLayers(stations,cameraArrayData){
    //map.removeLayer(frictionLayer);
    map.removeLayer(frictionCanvas)
    // add every tenth station to the first layer
    for(var i = 0; i< stations.length; i+=10){
        addStationToLayer(stations[i], 0,cameraArrayData);
    }

    // add every fifth station to the jth layer
    for(var j = 0; j < 5; j++){
        for(var i = j; i< stations.length; i+=5){
            // skip every tenth station
            if(i % 10 != 0){

                // merge the fourth and fifth layers into one
                if(j == 4){
                    addStationToLayer(stations[i], j,cameraArrayData);
                }else{
                    addStationToLayer(stations[i], j+1,cameraArrayData);
                }   
            }
        }
    }
    map.addLayer(layerGroups[0]);
}
