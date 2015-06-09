function draw_graph(x_name, y_name, data, svg_selection, colors){
	// prepare holder for graph in the svg element
	var margin = {left : 50, right: 10, top: 10, bottom: 40},
		width = 700 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;
	var svg = d3.select(svg_selection);
	
	// remove old graph
	svg.selectAll("*").remove();
 	
 	svg = svg.append("g")
 			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 	
 	// initialise transformation from data to pixels
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
 	
 	// get domain of all datasets together
 	domain_x = [Infinity, -Infinity]
 	domain_y = [Infinity, -Infinity]
 	for(i = 0; i < data.length; i++){
 		data[i].forEach(function(d){
 			if (d[x_name].getTime() > domain_x[1])
 			{
 				domain_x[1] = d[x_name].getTime()
 			}
 			else if (d[x_name].getTime() < domain_x[0])
 			{
 				domain_x[0] = d[x_name].getTime()
 			}

			if (d[y_name] > domain_y[1])
 			{
 				domain_y[1] = d[y_name]
 			}
 			else if (d[y_name] < domain_y[0])
 			{
 				domain_y[0] = d[y_name]
 			}
 		});
 	}
 	// transform domain into date domain
 	domain_x[0] = new Date(domain_x[0])
 	domain_x[1] = new Date(domain_x[1])
 	
 	// initialise domain
 	xtrans.domain(domain_x);
	ytrans.domain(domain_y);

	// add x axis to svg
	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0,"+ height +" )")
		.call(xAxis)
		.append("text")
			.attr("class", "text")
			.text(x_name)
			.attr("x", width - 100)
			.attr("dy", - 10);

	// add y axis to svg
	svg.append("g")
		.attr("class", "y-axis")
		.call(yAxis)
		.append("text")
			.attr("class", "text")
			.text(y_name)
			.attr("x", -120)
			.attr("dy", 15)
			.attr("transform", "rotate(-90)");
	
	// prepare line generator
	var line = d3.svg.line()
	 				.x(function(d){return xtrans(d[x_name]);})
	 				.y(function(d){return ytrans(d[y_name]);})

	// build a line for every dataset
	data.forEach(function(data ,i){
		
		// add data line to svg
		svg.append("path")
			.datum(data)
			.style("stroke", colors[i])
			.attr("class", "line " + data[0].speeker)
			.attr("d", line);
	});
}
