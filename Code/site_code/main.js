function main_graph() {
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
 				.x(function(d){return xtrans(d.date);})
 				.y(function(d){return ytrans(d.word);})

 	d3.csv("pairs_data.csv", function(error, data){
		data.forEach(function(d, i){
			// convert strings to date objects
			d.word = Number(d.word);
			d.date = parseDate(d.date, i);
		});
		xtrans.domain(d3.extent(data, function(d){return d.date;}));
		ytrans.domain(d3.extent(data, function(d){return d.word;}));

			// add x axis to svg
		svg.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate(0,"+ height +" )")
			.call(xAxis)
			.append("text")
				.attr("class", "text")
				.text("Time(days)")
				.attr("x", width - 100)
				.attr("dy", - 10);

		// add y axis to svg
		svg.append("g")
			.attr("class", "y-axis")
			.call(yAxis)
			.append("text")
				.attr("class", "text")
				.text("Temperature(\xb0C)")
				.attr("x", -120)
				.attr("dy", 15)
				.attr("transform", "rotate(-90)");

		// add data line to svg
		svg.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);
		});
}
