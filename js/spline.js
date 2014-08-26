

// var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = 1000,
    height = 500;

var xScale = d3.scale.linear().domain([0, 1000]).range([0, width], 10);
var yScale = d3.scale.linear().domain([0, 1]).range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10, "%");

var points = d3.range(1, 5).map(function(i) {
  return [i * width / 5, (height-(i*100)) ];
});

var dragged = null;
var selected = points[0];

var line = d3.svg.line();

var graph = d3.select("#curveEditor").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    ;

graph.append("rect")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", mousedown);

var curve = graph.append("path")
    .datum(points)
    .attr("class", "line")
    .attr("id", "animCurve")
    .call(redraw);

var curveLength = curve.node().getTotalLength();

graph.append("g")
  .attr("class", " x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("yScale", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup)
    .on("keydown", keydown);

d3.select("#interpolate")
    .on("change", change)
  .selectAll("option")
    .data([
      "linear",
      "step-before",
      "step-after",
      "basis",
      "cardinal",
      "monotone"
    ])
  .enter().append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });

graph.node().focus();

function redraw() {
  graph.select("path").attr("d", line);

  var circle = graph.selectAll("circle")
      .data(points, function(d) { return d; });

  circle.enter().append("circle")
      .attr("r", 1e-6)
      .on("mousedown", function(d) { selected = dragged = d; redraw(); })
    .transition()
      .duration(750)
      .ease("elastic")
      .attr("r", 6.5);

  circle
      .classed("selected", function(d) { return d === selected; })
      .attr("cx", function(d) { return d[0]; })
      .attr("cy", function(d) { return d[1]; });

  circle.exit().remove();

  if (d3.event) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
  }
}

function change() {
  line.interpolate(this.value);
  redraw();
}

function mousedown() {
  points.push(selected = dragged = d3.mouse(graph.node()));
  redraw();
}

function mousemove() {
  if (!dragged) return;
  var m = d3.mouse(graph.node());
  dragged[0] = Math.max(0, Math.min(width, m[0]));
  dragged[1] = Math.max(0, Math.min(height, m[1]));
  redraw();

  var xPos = d3.event.pageX;
  var x = xPos;
  var beginning = x;
  var end = curveLength;
  var target;

  while(true) {
    target = Math.floor((beginning + end) / 2);
    pos = curve.node().getPointAtLength(target);
    if (( target === end || target === beginning) && pos.x !== x) {
      break;
    }
    if (pos.x > x){
      end = target;
    } else if (pos.x < x) {
      beginning = target;
    } else {
      break;
    }

    // console.log("x and y of pointer: " + [pos.x, pos.y]);
    // console.log("mouse is at curve position x: "+ [xScale.invert(pos.x), yScale.invert(pos.y)]);
    
  }
}

var regEx = /[A-Z]/gi;

function mouseup() {
  if (!dragged) return;
  mousemove();
  dragged = null;

  curveLength = curve.node().getTotalLength();
  console.log("curveLength is: " + curveLength);

  var curveData = document.getElementById('animCurve');
  var curvePoints = curveData.getAttribute("d");
  console.log(curvePoints);
  curvePoints = curvePoints.replace(regEx, ',');
  console.log(curvePoints);
  curvePoints = curvePoints.split(',');
  console.log(curvePoints);
  if (Array.isArray(curvePoints)) {
    for (var i = 0; i < curvePoints.length; i++ ) {
      curvePoints[i] = parseInt(curvePoints[i]);
    }
    console.log(curvePoints);
    var distance  = curvePoints[curvePoints.length-2] - curvePoints[1];
    console.log("The distance between the first and last point is: " + distance);
  }
}

function keydown() {
  if (!selected) return;
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: { // delete
      var i = points.indexOf(selected);
      points.splice(i, 1);
      selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
      redraw();
      break;
    }
  }
}
