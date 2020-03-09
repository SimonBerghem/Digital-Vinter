var accidentData = [];


async function getAccidentDataTime(startTime, endTime){
    await $.getJSON("/api/getAccidentData", {startTime, endTime}, function(data){
        if(data.length === 0) {
            toggleAccidentData = false
        }
        drawAccidentData(data);
    });
    
}