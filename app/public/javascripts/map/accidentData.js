var accidentData = [];


async function getAccidentDataTime(startTime, endTime){
    await $.getJSON("api/getAccidentData", {startTime, endTime}, function(data){
        drawAccidentData(data);
    });
    
}