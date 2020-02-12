var frictionData = [];
var filteredfrictionData = [];


async function getAllFrictionData() {
    await $.getJSON("/api/getAllFrictionData", function(data) {
        frictionData = data;
    });    
}

async function getFrictionData(reporter) {
    await $.getJSON("/api/getFrictionData", {reporter}, function(data) {
        filteredfrictionData = data;
    });
    await drawFriction(filteredfrictionData)
}

async function getDistinctReporterorgFriction() {
    await $.getJSON("/api/getDistinctReporterorgFriction", function(data) {
        addtoMAPtoggle(data);
    });    
}


