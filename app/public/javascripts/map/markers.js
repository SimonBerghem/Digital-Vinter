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
var markerGroup = []
var accidentGroup = [];

let frictionCanvas = L.canvas({ padding: 0.5, pane: "circlemarkers", });
let accidentCanvas = L.canvas({paddin: 0.5, pane: "circlemarkers", });
//let frictionCanvas = new L.layerGroup();

function createFrictionLayer(filteredfrictionData) {
    circleGroup = [];
    map.removeLayer(frictionCanvas);
    frictionCanvas = L.canvas({ padding: 0.5, pane: "circlemarkers", });
    //frictionCanvas.clearLayers();

    for (var i = 0; i < filteredfrictionData.length; i += 1) { 

        if(filteredfrictionData[i].MeasureValue >= 0.35 && filteredfrictionData[i].MeasureValue < 1.00){
            var frictionPointColor ='#007000';

        }else if(filteredfrictionData[i].MeasureValue >= 0.25 && filteredfrictionData[i].MeasureValue < 0.34){
            var frictionPointColor ='#FFBF00';

        }else{
            // 0.00-0.25 and Measurevalues that aren't valid.
            var frictionPointColor ='#CC0000';
        }
        
        let circle = L.circleMarker([filteredfrictionData[i].Latitude, filteredfrictionData[i].Longitude], {
            renderer: frictionCanvas,
            color: frictionPointColor
          
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

let markers = L.markerClusterGroup({ chunkedLoading: true });

function drawAccidentData(accidentData){
    circleGroup = [];
    accidentCanvas = L.canvas({paddin: 0.5, pane: "circlemarkers", });

    for (var i = 0; i < accidentData.length; i+=1){
        try{
            let str = accidentData[i].WGS84;
            let str1 = accidentData[i].WGS84;
            let longitude = parseFloat(str.split(" ")[1].split("(")[1]);
            let latitude = parseFloat(str1.split(" ")[2].split(")")[0]);
            let circle = L.circleMarker([latitude, longitude],{
            renderer: accidentCanvas,
            color: '#00FFFF'
            });
            circle.bindPopup(popupAccident(accidentData[i], circle));
            circleGroup.push(circle);
            circle.addTo(map);
        }catch(error){
            // Ignore error
        }
    }
}


function createAggregatedFrictionLayer(aggregatedFrictionData, notAggregated) {
    markerGroup = [];
    map.removeLayer(markers);
    markers = L.markerClusterGroup({ chunkedLoading: true,
        iconCreateFunction: function (cluster) {
            children = cluster.getAllChildMarkers()
            childCount = cluster.getChildCount()
            let measureValueMin = 1
            
            // Separate logic depending on if we want to display aggregated friction data or not
            if(notAggregated) {
                children.forEach(child => {
                    if(measureValueMin > child.measureValue) {
                        measureValueMin = child.measureValue
                    }
                })
            } else {
                children.forEach(child => {
                    if(measureValueMin > child.measureValueMin) {
                        measureValueMin = child.measureValueMin
                    }
                })
            }
            

            var c = 'marker-cluster-';
            if (measureValueMin < 0.26) {
              c += 'red';
            } 
            else if (measureValueMin < 0.36) {
              c += 'yellow';
            } 
            else {
              c += 'green';
            }
           
            return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', 
             className: "marker-cluster" + " " + c, iconSize: new L.Point(40, 40) });
            } });

    aggregatedFrictionData.map(data => {
        let marker
        // Separate logic depending on if we want to display aggregated friction data or not
        if(notAggregated) {
            marker = L.marker(L.latLng(data.Latitude, data.Longitude));
            marker.measureValue = data.MeasureValue
        } else {
            marker = L.marker(L.latLng(data.latitude, data.longitude));
            marker.measureValueMin = data.measureValueMin
        }
        marker.bindPopup(popupAggregatedFriction(data, notAggregated));
        markerGroup.push(marker);
    })
    
    markers.addLayers(markerGroup);
    map.addLayer(markers);


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
    

    var lon = parseFloat(station.WGS84.split(" ")[1].split("(")[1]);
    var lat = parseFloat(station.WGS84.split(" ")[2].split(")")[0]);

    const id = "marker"+station.id;
    
    var marker = L.marker([lat, lon],{myCustomId: id});
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
