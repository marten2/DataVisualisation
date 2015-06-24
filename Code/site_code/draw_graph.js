function draw_graph_statistics(x_name, y_name, data, svg_selection, colors){
	// get svg dimensions and graph dimensions
	var svg = d3.select(svg_selection),
	svg_width = svg.style("width")
					.match(/\d/g)
					.join(""),
	svg_height = svg.style("height")
					.match(/\d/g)
					.join("");
	
	var margin = {left : 40, right: 30, top: 10, bottom: 40},
		width = svg_width - margin.left - margin.right,
		height = svg_height - margin.top - margin.bottom;
	
	// remove old graph
	svg.selectAll("*").remove();
 	
 	// prepare graph holder
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
 	console.log(domain_x)
 	
 	// initialise domain
 	xtrans.domain(domain_x);
	ytrans.domain(domain_y);

	// add x axis to svg
	svg.append("g")
		.attr("class", "x-axis axis")
		.attr("transform", "translate(0,"+ height +" )")
		.call(xAxis)
		.append("text")
			.attr("class", "text")
			.text(x_name)
			.attr("x", width - 100)
			.attr("dy", - 10);

	// add y axis to svg
	svg.append("g")
		.attr("class", "y-axis axis")
		.call(yAxis)
		.append("text")
			.attr("class", "text")
			.text(y_name)
			.attr("x", -150)
			.attr("dy", 15)
			.attr("transform", "rotate(-90)");
	
	// prepare line generator
	var line = d3.svg.area()
	 				.x(function(d){return xtrans(d[x_name]);})
	 				.y(function(d){return ytrans(d[y_name]);})
	 				.interpolate('step-after');
	
	// build a line for every dataset
	data.forEach(function(data ,i){
		svg.append("path")
			.datum(data)
			.attr("class", function(d){return "line " + d[0].speeker;})
			.style("stroke", function(d){
				// color is dependend if corresponding checkbox is checked or not
				var box = d3.select(".selector." + d[0].speeker)
				var color = box[0][0].checked ? colors[d[0].speeker] : "rgb(200, 200, 200)";
				return color
			})
			.attr("d", line);
	});
}