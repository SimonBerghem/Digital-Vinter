/**
 * The main Leaflet map gets created with a defined view.
 */
const map = L.map('mapid').setView([62.97519757003264, 15.864257812499998], 5);
map.doubleClickZoom.disable(); 

map.createPane("circlemarkers");
map.getPane("circlemarkers").style.zIndex = 400;
//map.getPane('circlemarkers').style.pointerEvents = 'none';

/**
 * Holds all the average weather data.
 */
let averageData = [];




const southWest = L.latLng(54,0);
const northEast = L.latLng(72, 32);
/**
 * Restrict the map movement
 */
const bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);
map.on('drag', function () {
    map.panInsideBounds(bounds, { animate: false });
});


map.on('zoomend', function() {
    // Difference between zoom level and group number = 5
    addMarkerOnZoom(map.getZoom()-5);
    removeMarkerOnZoom(map.getZoom()-5);

});

/**
 * Information box controller containing county information on hover
 */
const info = L.control();

info.onAdd = function (map) {
    this._map = map;
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = '<h4>Sverige medeltemperatur per län</h4>' +  (props ?
        '<b>' + props.name + '</b> ' +
        '<br /> Lufttemperatur: '   + averageData[props.countyCode][1].toFixed(1)+ '\xB0C'+
        '<br /> Vägtemperatur: ' + averageData[props.countyCode][2].toFixed(1) + '\xB0C'
        : 'Hovra över län');
        
};
info.addTo(map);


/**
 * This method returns a color depending on the temperature value
 * @param {*} temperature a float value 
 */
function getColor(temperature) {
    return  temperature > 35  ? '#990000' :
            temperature > 30  ? '#CC0000' :
            temperature > 25 ? '#FF0000' :
            temperature > 20  ? '#FF3333' :
            temperature > 15   ? '#FF6666' :
            temperature > 10   ? '#FF9999' :
            temperature > 5   ? '#FFCCCC' :
            temperature > 0  ? '#FFDCDC' :
            temperature > -5  ? '#CCE5FF' :
            temperature > -10 ? '#99CCFF' :
            temperature > -15  ? '#66B2FF' :
            temperature > -20   ? '#3399FF' :
            temperature > -25   ? '#0080FF' :
            temperature > -30   ? '#0066CC' :
            temperature > -35   ? '#004C99' :
                                  '#003366';
}
/**
 * This method returns a color depending on the friction value
 * @param {*} temperature a float value 
 */
function getFrictionColor(frictionvalue) {
    return  frictionvalue > 1.0  ? '#EDE285' :
    frictionvalue > 0.9 ? '#C9E36F' :
    frictionvalue > 0.8  ? '#96D858' :
    frictionvalue > 0.7  ? '#60CB42' :
    frictionvalue > 0.6   ? '#33BD3B' :
    frictionvalue > 0.5   ? '#27AC55' :
    frictionvalue > 0.4   ? '#1D9A6C' :
    frictionvalue > 0.3  ? '#18907C' :
    frictionvalue > 0.2 ? '#138386' :
    frictionvalue > 0.1  ? '#0C4571' :
    frictionvalue > 0.0  ? '#082B65' :
    '#041531';
}



/**
 * Controls the temperature scale box on map.
 */

const temperatureScale = L.control({position: 'bottomright'});

temperatureScale.onAdd = function (map) {

    const maindiv = L.DomUtil.create('div');
    const div = L.DomUtil.create('div', 'info legend'),
          title = "Temp",
          scales = [35, 30, 25, 20, 15, 10, 5, 0, -5, -10, -15, -20, -25, -30, -35],
          labels = [];


    maindiv.innerHTML+= '<button id="tempButton" class="oButton">'+title+'</button>';

    for (var i = 0; i < scales.length; i++) {
        if(i == 0){
            div.innerHTML +=  '<div class ="scalediv tempdiv"> <i style="background:' + getColor(scales[i]) + '"></i> >' + scales[i] + '<br>' + '</div>';
        }else if(i == scales.length -1) {
            div.innerHTML +=  '<div class ="scalediv tempdiv"> <i style="background:' + getColor(scales[i]) + '"></i> <' + scales[i] + '</div>';
        }else {
            div.innerHTML +=  '<div class ="scalediv tempdiv"> <i style="background:' + getColor(scales[i]) + '"></i> ' + (scales[i]) + '<br>'+ '</div>';
        }
    }
    maindiv.append(div);
    return maindiv;
};
temperatureScale.addTo(map);





/**
 * Controls the friction scale box on map.
 */
const frictionScale = L.control({position: 'bottomright'});

frictionScale.onAdd = function (map) {

    const maindiv = L.DomUtil.create('div');
    const div = L.DomUtil.create('div', 'info legend'),
          title = "Friktion",
          scales = [1.0,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1,0.0],
          labels = [];

    maindiv.innerHTML+= '<button id="friktionButton" class="oButton">'+title+'</button>';

    for (var i = 0; i < scales.length; i++) {
        if(i == 0){
            div.innerHTML +=  '<div class ="scalediv frikdiv"> <i style="background:' + getFrictionColor(scales[i]) + '"></i> >' + scales[i] + '<br>' + '</div>';
        }else if(i == scales.length -1) {
            div.innerHTML +=  '<div class ="scalediv frikdiv"> <i style="background:' + getFrictionColor(scales[i]) + '"></i> <' + scales[i] + '</div>';
        }else {
            div.innerHTML +=  '<div class ="scalediv frikdiv"> <i style="background:' + getFrictionColor(scales[i]) + '"></i> ' + (scales[i]) + '<br>'+ '</div>';
        }
    }
    maindiv.append(div);
    return maindiv;
};
frictionScale.addTo(map);




/*
    This function minimizes the scalediv for the button associated with it.
*/

$(".oButton").click(function(){
    //alert(this.id);
    $(this).toggleClass('buttonminimize');

    switch(this.id){
        case "friktionButton":
            $(".frikdiv").slideToggle();
            break;
        case "tempButton":
            $(".tempdiv").slideToggle();
            break;
        default:
            //
            break;

    }
});




