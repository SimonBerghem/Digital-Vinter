var frictionData = [];
var filteredfrictionData = [];
var aggregatedFrictionData = [];

const TIMEAGGREGATIONENUM = {
    'No Aggregation': 'No Aggregation',
    1: "Timme",
    24: "Dag",
    168: "Vecka",
    672: "Månad"
  }


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

async function getAggregatedFrictionData(distance, timeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction, autoAggregation) {
    // Disable search button to ensure that user cant make a new query before the query has ended
    document.getElementById('searchButton').disabled = true
    await $.getJSON("/api/getAggregatedFrictionData", {distance, timeAggregation, startTime, endTime, reporterOrganization, mapBounds, maxFriction, autoAggregation}, function(data) {
        document.getElementById('searchButton').disabled = false
        if(data.success) {
            const notAggregated = data.distance === "No Aggregation"
            if(data.autoAggregation) {
                document.getElementById("distance").value = data.distance
                document.getElementById("timeAggregation").value = TIMEAGGREGATIONENUM[data.timeAggregation]
            }
            drawAggregatedFriction(data.result, notAggregated)
        } else {
            if(data.autoAggregation) {
                alert("Unable to choose good parameters for auto aggregation. Change max friction, date or view and try again or manually choose aggregation parameters.")
            } else {
                alert("Choice of aggregation parameters invalid. Result would be too much data too render on webpage without a crash. (>50000)")
            }
            
        }
    });
}

const getDataDateRange = async () => {
    await $.getJSON("/api/getDataDateRange", function(data) {
        const { startDate, endDate } = data
        createSlider(startDate, endDate);
    }); 
}

