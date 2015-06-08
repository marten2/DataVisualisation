function draw_graph(x_name, y_name, data, svg_selection){
	var margin = {left : 50, right: 10, top: 10, bottom: 40},
		width = 700 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;
	
	var svg = d3.select(svg_selection);
	svg.selectAll("*").remove();
 	svg = svg.append("g")
 			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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
 	domain_x = [Infinity, -Infinity]
 	domain_y = [Infinity, -Infinity]
 	for(i = 0; i < data.length; i++){
 		data[i].forEach(function(d){
 			if (d[x_name].getTime > domain_x[1])
 			{
 				domain_x[1] = d[x_name]
 			}
 			else if (d[x_name].getTime < domain_x[0])
 			{
 				domain_x[0] = d[x_name]
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
 	
 	xtrans.domain(x_domain);
	ytrans.domain(y_domain);

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
	data.forEach(function(data){
		var line = d3.svg.line()
	 				.x(function(d){return xtrans(d[x_name]);})
	 				.y(function(d){return ytrans(d[y_name]);})

		// add data line to svg
		svg.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);
	});
}
