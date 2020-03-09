var frictionData = [];
var filteredfrictionData = [];
var aggregatedFrictionData = [];


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

async function getAggregatedFrictionData(radius, timeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction) {
    await $.getJSON("/api/getAggregatedFrictionData", {radius, timeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction}, function(data) {
        aggregatedFrictionData = data;
    });
    await drawAggregatedFriction(aggregatedFrictionData)
}

const getDataDateRange = async () => {
    await $.getJSON("/api/getDataDateRange", function(data) {
        const { startDate, endDate } = data
        createSlider(startDate, endDate);
    }); 
}

