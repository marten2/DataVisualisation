"use strict";

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
 	var xtrans = get_xTrans(x_name, data, width);

 	var ytrans = get_yTrans(y_name, data, height);

 	// initialise x axis
 	var xAxis = d3.svg.axis()
 					.scale(xtrans)
 					.orient("bottom")
 	
 	// initialise y axis
 	var yAxis = d3.svg.axis()
 					.scale(ytrans)
 					.orient("left");

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
	
	// prepare line generator, make it steplines
	var line = d3.svg.area()
	 				.x(function(l){return xtrans(l[x_name]);})
	 				.y(function(l){return ytrans(l[y_name]);})
	 				.interpolate('step-after');
	
	// build a line for every dataset
	data.forEach(function(data ,i){
		var box = d3.select(".selector." + data[0].speeker),
			checked = box[0][0].checked;
		draw_line(checked, data, data[0].speeker, line, colors);
	});
}

function draw_line(checked, data, pres, line, colors){
	/*Draws line from data, with color if checkbox is checked without if not*/

	// draw line colored and as highest if checked
	if (checked)
	{
		d3.select("#speech-graph").select("g")
			.append("path")
			.datum(data)
			.attr("class", "line " + pres)
			.style("stroke", colors[pres])
			.attr("d", line);
	}
	// draw line gray and as lowest lair if checked
	else
	{
		d3.select("#speech-graph").select("g")
			.insert("path", ":first-child")
			.datum(data)
			.attr("class", "line " + pres)
			.style("stroke", "rgb(200, 200, 200)")
			.attr("d", line);
	}
}

function get_xTrans(x_name, data, width){
	/* Determands transformation with given data */
	 
	 var domain_x = [Infinity, -Infinity];
	 for(var i = 0; i < data.length; i++){
 		data[i].forEach(function(d){
 			if (d[x_name].getTime() > domain_x[1])
 			{
 				domain_x[1] = d[x_name].getTime()
 			}
 			else if (d[x_name].getTime() < domain_x[0])
 			{
 				domain_x[0] = d[x_name].getTime()
 			}
 		});
 	}
 	var xtrans = d3.time.scale()
				.range([0, width])
				.domain(domain_x);
	return xtrans
}
function get_yTrans(y_name, data, height){
	/* Determands transformation with given data */
 	
 	var domain_y = [Infinity, -Infinity];

 	for(var i = 0; i < data.length; i++){
 		data[i].forEach(function(d){
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
	var ytrans = d3.scale.linear()
				.range([height, 0])
				.domain(domain_y);
 	return ytrans;
}