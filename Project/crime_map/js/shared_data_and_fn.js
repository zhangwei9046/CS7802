/**
 * Created by brian on 7/26/17.
 */

(function () {
    var $infoName = $('#info-name');
    var $infoDesc = $('#info-desc');
    var SCALING_FACTOR = window.consts.SCALING_FACTOR;
    var consts = window.consts;
    var CRIME_TYPES = consts.ALL_CRIME_TYPES;
	var uiShowCrimes = {};
	CRIME_TYPES.forEach(function (crimeType) {
		uiShowCrimes[crimeType] = true;
	});
    
    function calculateCurrentShowCrimes(d) {
        var crimesShown = [];
        d['Crimes'].forEach(function (crime) {
            if (uiShowCrimes[crime]) {
                crimesShown.push(crime)
            }
        });
        return crimesShown.length;
    }
    
    function calculateCurrentShowCrimesAll(allMapDatas) {
        return allMapDatas.map(function (d) {
            return {
                d: d,
                shownCrimes: calculateCurrentShowCrimes(d),
                zhvi: d.zhvi,
                crimeOverArea: calculateShownCrimesByArea(d),
            };
        })
    }
    
    function calculateShownCrimesByArea(d) {
        return calculateCurrentShowCrimes(d) / d['Area'] * SCALING_FACTOR
    }
    
    function calculateCrimesByArea(d) {
        return d['Crimes'].length / d['Area'] * SCALING_FACTOR
    }
    
    function updateSelectedDescription(d) {
        var zhvi = d.zhvi;
        var cost = zhvi !== -1 ? '$' + zhvi.toLocaleString() : 'Not available';
        var showCrimes = calculateCurrentShowCrimes(d);
        var shownCrimeOverArea = calculateShownCrimesByArea(d).toFixed(4);
        var crimeOverArea = calculateCrimesByArea(d).toFixed(4);
        $infoName.text(d.Name);

        var htmlList = '<ul>';
        htmlList += '<li>' + 'Median Zhvi: ' + cost + '</li>';
        htmlList += '<li>' + 'Total Number of Crimes: ' + d.NumCrimes + '</li>';
        htmlList += '<li>' + 'Selected Number of Crimes: ' + showCrimes + '</li>';
        htmlList += '<li>' + 'Total Crime / Area: ' + crimeOverArea + '</li>';
        htmlList += '<li>' + 'Selected Crime / Area: ' + shownCrimeOverArea + '</li>';
        // htmlList += '<li>' + 'Relative Crime by Area: ' + d.CrimeOverArea + '</li>';
        htmlList += '</ul>';
        $infoDesc.html(htmlList);
    }
    
    var sharedData = window.sharedData = {};
    sharedData.crimeUI = {
        showCrimes: uiShowCrimes,
    };
    sharedData.calculateCurrentShowCrimes = calculateCurrentShowCrimes;
    sharedData.calculateCurrentShowCrimesAll = calculateCurrentShowCrimesAll;
    sharedData.calculateCrimesByArea = calculateShownCrimesByArea;
    sharedData.updateSelectedDescription = updateSelectedDescription;
    sharedData.resetMapColors = function () {}; // gets sets by housing_price.js
    
    

})();
