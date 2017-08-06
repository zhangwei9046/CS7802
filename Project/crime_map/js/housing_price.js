// reference:
// https://bl.ocks.org/john-guerra/43c7656821069d00dcbc
(function () {
    // "imports"
    var consts = window.consts;
    var projection = consts.projection;
    var height = consts.height;
    // var showCrimes = window.sharedData.crimeUI.showCrimes;
    var calculateCurrentShowCrimes = window.sharedData.calculateCurrentShowCrimes;
    var calculateCrimesByArea = window.sharedData.calculateCrimesByArea;

    // set on init;
    var bigText;
    var mapLayer;
    var scaleLayer;

    var color = d3.scale.linear()
        .range(['#E0FFE6', '#006B2A']);
    
    var path = d3.geo.path()
            .projection(projection);

    // var dummyText = g.append('text')
    //     .classed('dummy-text', true)
    //     .attr('x', 10)
    //     .attr('y', 30)
    //     .style('opacity', 0);


    function getFnMinZhviOrMax(max) {
        return function (d) {
            var zhvi = d && d.properties && d.properties.zhvi ? d.properties.zhvi : max;
            return zhvi === -1 ? max : zhvi;
        }
    }
    
    
    // Get province name
    function nameFn(d){
        return d && d.properties ? d.properties.name : null;
    }

    function zhviFn(d) {
        return d && d.properties ? d.properties.name : null;
    }

    function getZvhiOr0(d){
        return d && d.properties ? d.properties.zhvi : 0;
    }

// Get color
    function fillFn(d){
        var zhvi = d.properties.zhvi;
        if (!zhvi) {
        } else if (zhvi === -1) {
            return 'white';
        }
        return color(zhvi);
    }


    function addDescription(d) {
        window.sharedData.updateSelectedDescription(d);
    }

    function mouseover(d){
        // Highlight hovered province
        d3.select(this).style('fill', 'orange');

        // Draw effects
        addDescription(d.properties);
        var $el = $('.scatter-region-' + d.properties['RegionID'])
        $el.addClass('active');
        // console.log('id:', d.properties['RegionID']);
//		textArt(nameFn(d));
    }
    
    function resetMapColors() {
        // Reset province color
        mapLayer.selectAll('path')
            .style('fill', function(d){
                return fillFn(d);
            });
    }

    function mouseout(d){
        // Reset province color
        resetMapColors();
        var $el = $('.scatter-region-' + d.properties['RegionID'])
        $el.removeClass('active');
    }
    
    function init(g) {
        mapLayer = g.append('g')
            .classed('map-layer', true);
        scaleLayer = g.append('g')
            .classed('scale-layer', true);

    }
    function renderScale(min_zvhi, max_zvhi) {
        var scaleLayerGradient = scaleLayer
            .append('defs')
            .append('linearGradient')
            .attr('id', 'linear-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');
    
        var minScaleText = scaleLayer
            .append('text')
            .attr('x', 30)
            .attr('y', height-30);
    
        var maxScaleText = scaleLayer
            .append('text')
            .attr('x', 170)
            .attr('y', height-30);
        scaleLayerGradient
            .append('stop')
            .attr('stop-color', color(min_zvhi))
            .attr('offset', '0%');
        scaleLayerGradient
            .append('stop')
            .attr('stop-color', color(max_zvhi))
            .attr('offset', '100%');

        scaleLayer
            .append('rect')
            .attr('x', 40)
            .attr('y', height - 20)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('width', 200)
            .attr('height', 20)
            .attr('fill', 'url(#linear-gradient)');

        minScaleText.text('$' + min_zvhi.toLocaleString());
        maxScaleText.text('$' + max_zvhi.toLocaleString());
    }
    
    function renderMap(mapData) {
        var features = mapData.features;
        var max_zvhi = d3.max(features, getZvhiOr0);
        var min_zvhi = d3.min(features, getFnMinZhviOrMax(max_zvhi));
        color.domain([min_zvhi, max_zvhi]);

        renderScale(min_zvhi, max_zvhi);

        // Draw each province as a path
        mapLayer.selectAll('path')
            .data(features)
            .enter().append('path')
            .attr('d', path)
            .attr('vector-effect', 'non-scaling-stroke')
            .style('fill', fillFn)
            .attr('class', function (d) {
                return 'map-region-'  + d.properties['RegionID']
            })
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
//				.on('click', clicked);

    }
    
    // "exports"
    var map = window.hmap = {};
    // hmap.width = width;
    // hmap.height = height;
    hmap.init = init;
    hmap.renderMap = renderMap;
    sharedData.resetMapColors = resetMapColors;

})();
