/**
 * Created by brian on 7/22/17.
 */

// should be last file in HTML

(function () {
	// "Imports"
	var p911 = window.p911;
	var hmap = window.hmap;
	var crimeHousingScatter = window.crimeHousingScatter;
	var consts = window.consts;

	var width = consts.width;
	var height = consts.height;

	// Set svg width & height
	var svg = d3.select('svg')
		.attr('width', width)
        .attr('height', height);
	
    // Add background
    svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height);
//			.on('click', clicked);

	var g = svg.append('g');

	// call inits on imports so they can setup their map interactions
	// call hmap first so that it dots can paint on top of it
	hmap.init(g);
	p911.init(g);


	// Neighborhoods
	// d3.json("Zillow_Zhvi_Neighborhoods_WA_Geo.json", function(error, mapData) {
	// 	hmap.renderMap(mapData);
	// });
	
	d3.json("Zillow_Zhvi_Neighborhoods_WA_Geo.json", function(error, mapData) {
		hmap.renderMap(mapData);
		crimeHousingScatter.init(mapData);
		crimeHousingScatter.drawScatter();
	});

	d3.csv('short_incident.csv', function (error, data) {
		p911.renderFilterPoliceDotsUI(data);
		p911.renderPoliceDots(data);
	});


	var RESIZE_WAIT_PERIOD = 500;
	var mainContainer = $('#main-container');
	var prevHeight = mainContainer.height();
	var prevWidth = mainContainer.width();
	function checkForResizeLoop() {
		var currHeight = mainContainer.height();
		var currWidth = mainContainer.width();
		console.log(`loop ${prevHeight} === ${currHeight}`);
		if ((currHeight !== prevHeight) || (currWidth !== prevWidth) &&
			window.parent && window.parent.iframeLoaded) {
			window.parent.iframeLoaded();
		}
		prevHeight = currHeight;
		prevWidth = currWidth;
		setTimeout(checkForResizeLoop, RESIZE_WAIT_PERIOD);
	}
	checkForResizeLoop();

	// var waitingForResize = false;
	// $(window).resize(function() {
	// 	console.log('resize, waiting?', waitingForResize)
	// 	var RESIZE_WAIT_PERIOD = 500;
	// 	if (!waitingForResize && window.parent && window.parent.iframeLoaded) {
	// 		setTimeout(function () {
	// 			console.log('setTimeout');
	// 			window.parent.iframeLoaded();
	// 			setTimeout(function () {
					// waitingForResize = false;
				// }, 50);
			// }, RESIZE_WAIT_PERIOD);
		// }
		// waitingForResize = true;
    // });

})();
