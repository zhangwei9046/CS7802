console.log('hello');
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};

var xSelectData = [ {"text": "MedianHouseHoldIncome"},
                    {"text": "Population"},
                    {"text": "PopulationDensity"},
                    {"text": "MedianSchoolRating"},
                    {"text": "WalkScore"},
                    {"text": "TransitScore"},
                    {"text": "BikeScore"} ]
var ySelectData = [ {"text": "HousingPrice" },
                     {"text": "MedianRent" }]

// Variables
var body = d3.select('body');
console.log(body);

var margin = { top: 50, right: 50, bottom: 50, left: 60 };
var h = 500 - margin.top - margin.bottom;
var w = 1000 - margin.left - margin.right;

// SVG
var svg = body.append('svg')
    .attr('height',h + margin.top + margin.bottom)
    .attr('width',w + margin.left + margin.right)
  .append('g')
    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')

var circles = svg.selectAll('circle')

function handleClick(event) {
  var value = document.getElementById("myVal").value;
  console.log(value);

  var xSel = document.getElementById('xSelect')
  var ySel = document.getElementById('ySelect')
  var xValue = xSel.options[xSel.selectedIndex].value;
  var yValue = ySel.options[ySel.selectedIndex].value;

  if (yValue == 'HousingPrice') {
    yValue = 'Zhvi';
  }

  d3.selectAll('circle')
    .filter(function(d) { 
      return (d[xValue] != 0 && d[yValue] != 0 && d['Neighborhood'].toLowerCase().indexOf(value) != -1);
    })
    .transition().duration(1000)
      .delay(function (d,i) { return i*1})
      .attr('r',50)
  
  // console.log(d3.selectAll('circle').filter(function(d) { return d['Neighborhood'] == value }));
  return false;
  
}


d3.csv('neighborhood_data.csv',function (data) {
  // console.log(data);
  // CSV section
  
  // Select X-axis Variable
  var span = body.append('span')
    .text('Select X-Axis variable: ')
  var xInput = body.append('select')
      .attr('id','xSelect')
      .on('change',xChange)
    .selectAll('option')
      .data(xSelectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text; })
      .text(function (d) { return d.text;})
  body.append('br')

  // Select Y-axis Variable
  var span = body.append('span')
      .text('Select Y-Axis variable: ')
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(ySelectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text; })
      .text(function (d) { return d.text;})
  body.append('br')

  
  
  // var formatPercent = d3.format('.2%')
  // Scales
  var colorScale = d3.scale.category20()

  var xScale = d3.scale.linear()
    .domain([
      d3.min(data,function (d) { return parseInt(d['MedianHouseHoldIncome']) }) - 1,
      d3.max(data,function (d) { return parseInt(d['MedianHouseHoldIncome']) }) + 1
      ])
    .range([0,w])

  var yScale = d3.scale.linear()
    .domain([
      d3.min(data,function (d) { return parseInt(d['Zhvi']) }) - 1,
      d3.max(data,function (d) { return parseInt(d['Zhvi']) }) + 1
      ])
    .range([h,0])

  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    // .tickFormat(formatPercent)
    // .ticks(5)
    .orient('bottom')
  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    // .tickFormat(formatPercent)
    // .ticks(5)
    .orient('left')
  

  // Circles
  circles
      .data(data)
      .enter()
    .append('circle')
      .filter(function(d) {return parseInt(d['Zhvi']) != 0})
      .attr('id', 'circle')
      .attr('cx',function (d) { return xScale(d['MedianHouseHoldIncome']) })
      .attr('cy',function (d) { return yScale(d['Zhvi']) })
      .attr('r','8')
      .attr('fill',function (d,i) { return colorScale(i) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr('r',50)
          .attr('stroke-width',1)
        d3.select(this)
          .moveToBack();
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr('r',8)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return d.Neighborhood +
                           '\nZipcode: ' + d['Zipcode'] +
                           '\nPopulation: ' + d['Population'] + 
                           '\nPopulationDensity: ' + d['PopulationDensity'] +
                           '\nMedianHouseHoldIncome: ' + d['MedianHouseHoldIncome'] +
                           '\nMedianSchoolRating(10): ' + d['MedianSchoolRating'] +
                           '\nWalkScore(100): ' + d['WalkScore'] +
                           '\nTransitScore(100):' + d['TransitScore'] +
                           '\nBikeScore(100):' + d['BikeScore']
                            })

drawRegressionLine('MedianHouseHoldIncome', 'Zhvi');

function drawRegressionLine(x, y) {
  d3.select('.trendline').remove();
  // console.log('fff');
  var xSeries = data.map(function(d) { 
    if (parseFloat(d[x]) != 0 && parseFloat(d[y]) != 0) {
      return parseFloat(d[x])
    }
    return 0;
  })
  var ySeries = data.map(function(d) { 
    if (parseFloat(d[x]) != 0 && parseFloat(d[y])) {
      return parseFloat(d[y])
    } else {
      return 0;
    }
  });

  // xSeries = removeZeros(xSeries_);
  // ySeries = removeZeros(ySeries_);

  var leastSquaresCoeff = leastSquares(xSeries, ySeries);

  // apply the reults of the least squares regression
  var x1 = d3.min(xSeries);
  // console.log(x1);
  var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
  var x2 = d3.max(xSeries);
  var y2 = leastSquaresCoeff[0] * (d3.max(xSeries) - d3.min(xSeries)) + leastSquaresCoeff[1];
  var trendData = [[x1,y1,x2,y2]];
    
  var trendline = svg.selectAll(".trendline")
    .data(trendData);

  trendline.enter()
    .append("line")
    .attr("class", "trendline")
    .attr("x1", function(d) { return xScale(d[0]); })
    .attr("y1", function(d) { return yScale(d[1]); })
    .attr("x2", function(d) { return xScale(d[2]); })
    .attr("y2", function(d) { return yScale(d[3]); })
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .transition().duration(1000)
    .delay(function (d,i) { return i*1});

    var totalLength = trendline.node().getTotalLength();
    trendline
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(1000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
}

  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('id','xAxisLabel')
      .attr('y',-6)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('MedianHouseHoldIncome')
  // Y-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','yAxis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('HousingPrice')


  function yChange() {
    var value = this.value // get the new y value
    // console.log(value);
    if (value == 'HousingPrice') {
      value = 'Zhvi';
    }
    yScale // change the yScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return parseInt(d[value]) })]),
        d3.max([0,d3.max(data,function (d) { return parseInt(d[value]) })])
        ])
    yAxis.scale(yScale) // change the yScale

    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(1000)
      .call(yAxis);

    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value);

    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*1})
        .attr('cy',function (d) { return yScale(d[value]) })

    var sel = document.getElementById('xSelect')
    var xValue = sel.options[sel.selectedIndex].value;
    var yValue = value;
    console.log(xValue);
    console.log(yValue);
    drawRegressionLine(xValue, yValue);
  }

  function xChange() {
    var value = this.value; // get the new x value
    // console.log(value);
    xScale // change the xScale
      .domain([
        d3.min(data,function (d) { return parseInt(d[value]); }) - 1,
        d3.max(data,function (d) { return parseInt(d[value]); }) + 1
        ])
    xAxis.scale(xScale) // change the xScale
    d3.select('#xAxis') // redraw the xAxis
      .transition().duration(1000)
      .call(xAxis)
    d3.select('#xAxisLabel') // change the xAxisLabel
      .transition().duration(1000)
      .text(value);
    d3.selectAll('circle')
      .filter(function(d) {return parseInt(d[value]) == 0})
      .remove();
    d3.selectAll('circle')
      .filter(function(d) { return parseInt(d[value]) != 0})
      .transition().duration(1000)
      .delay(function (d,i) { return i*1})
        .attr('cx',function (d) { return xScale(d[value]) })

    var sel = document.getElementById('ySelect')
    var yValue = sel.options[sel.selectedIndex].value;
    var xValue = value;
    console.log(xValue);
    if (yValue == 'HousingPrice') {
      yValue = 'Zhvi'
    }
    drawRegressionLine(xValue, yValue);
  }

  // returns slope, intercept and r-square of the line
  function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function(prev, cur) { return prev + cur; };
    
    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
      .reduce(reduceSumFunc);
    
    var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
      .reduce(reduceSumFunc);
      
    var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
      .reduce(reduceSumFunc);
      
    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
    
    return [slope, intercept, rSquare];
  }
})