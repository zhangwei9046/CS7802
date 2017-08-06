$(document).ready(function () {
    var CRIME_SCALING_FACTOR = 1./100000;  // see crime_map/js/consts.js
    var neighborhoodCrime = [];
    var crimeSlider;
    d3.json('crime_map/Zillow_Zhvi_Neighborhoods_WA_Geo.json', function (crimeDataGeoJson) {
        neighborhoodCrime = getNeighborhoodCrime(crimeDataGeoJson);
        init();
        _consoleLog('neigh', neighborhoodCrime)
    });


    function getNeighborhoodCrime(crimeDataGeoJson) {
        var features = crimeDataGeoJson.features;
        return features.map((feature) => ({
            neighborhood: feature.properties.Name,
            crimeOverArea: feature.properties.NumCrimes / feature.properties.Area * CRIME_SCALING_FACTOR
        }));
    }

    function init() {
        crimeInit();
    }

    function crimeInit() {
        var intCrimeRange = d3.extent(neighborhoodCrime, (d) => parseInt(d.crimeOverArea));
        intCrimeRange[1] += 1; // increase it by 1 incease we rounded down
        crimeSlider = $("#ex1").slider({
            type: "text",
            ticks: intCrimeRange,
            ticks_labels: intCrimeRange.map((d) => d.toString()),
        });
        crimeSlider.on("slide", function(slideEvt) {
            recalculateRecommendation();
        });
    }

    function recalculateRecommendation() {
        _consoleLog('passing crime');
        _consoleLog(getPassingCrime())
    }

    function getPassingCrime() {
        var crimeSliderVal = crimeSlider.slider('getValue');
        return neighborhoodCrime.filter((n) => n.crimeOverArea < crimeSliderVal)
    }

});
