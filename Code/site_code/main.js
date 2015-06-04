window.onload = function() {
	// build svg element with room for axes
	var margin = {left : 50, right: 10, top: 10, bottom: 40},
		width = 700 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;
 	var svg = d3.select("#speech-graph")
 				.append("g")
 					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 	var parseDate = d3.time.format("%Y/%m/%d").parse;
 	
 	var xtrans = d3.time.scale()
 					.range([0, width]);
 	var ytrans = d3.scale.linear()
 					.range([height, 0]);
 	
 	// initialise x axis
 	var xAxis = d3.svg.axis()
 					.scale(xtrans)
 					.orient("bottom")
 	// initialise y axis
 	var yAxis = d3.svg.axis()
 					.scale(ytrans)
 					.orient("left");

 	var line = d3.svg.line()
 				.x(function(d){return xtrans(d[0]);})
 				.y(function(d){return ytrans(d[1]);})

 	d3.json("data.json", function(error, data){
		data.forEach(function(d){
			// convert strings to date objects
			d[0] = parseDate(d[0]);
		});
	});
}
