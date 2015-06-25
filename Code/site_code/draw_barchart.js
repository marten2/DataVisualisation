"use strict";

function make_barchart(x_data, y_data, data, svg_selection, state, colors){
	/* Takes a data type to set on the x-axis an y-axis, aswel as a state. Builds
	with this a barchart dependend on the data.*/

	// get svg dimensions and barchart dimensions
	var svg = d3.select(svg_selection),
	svg_width = svg.style("width")
					.match(/\d/g)
					.join(""),
	svg_height = svg.style("height")
					.match(/\d/g)
					.join("");
	var margin = {left : 50, right: 30, top: 40, bottom: 40},
		width = svg_width - margin.left - margin.right,
		height = svg_height - margin.top - margin.bottom;

	// clear svg
	svg.selectAll("*").remove();

	// add a title
	svg.append("text")
		.attr("y", margin.top/2)
		.attr("x", margin.left)
		.attr("dy", ".35em")
		.text(state + ", " + x_data)

	// ad barchart holder
	svg = svg.append("g")
 			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 	
 	// initialise transformation from data to pixels
 	var state_data = []
 	var max = 0

 	// get averaged data per candidat for selected state and selected data type
 	data.forEach(function(dataset, i){
 		var total_speeches = 0
 		state_data[i] = new Object;
 		state_data[i].x = 0;
 		dataset.forEach(function(d){
 			if (d[x_data] > max){max = d[x_data]}
 			if (d.title === state){
 				state_data[i].x = state_data[i].x + d[x_data];
 				total_speeches++;
 			}
 		});
 		state_data[i].y = dataset[0][y_data];
 		state_data[i].x = state_data[i].x/total_speeches;
 	});
 	// get x transformation
	var x = d3.scale.linear()
		.domain([0, max])
		.range([0, width]);

	// initialise sizes of text
	var textSize = 70;
	var barHeight = 20;

	// bind data to rects for barchart
	var bar = svg.selectAll("g")
		.data(state_data)
		.enter().append("g")
			.attr("transform" , function(d, i){return"translate(0, " + i * barHeight + ")";});

	// build rect size dependend on data
	bar.append("rect")
		.attr("x", textSize)
		.attr("width", function(d){
			if (x(d.x)){
				return String(x(d.x)) + "px";
			}
			else{
				return "0px";
			}})
		.attr("height", barHeight - 1)
		.style("fill", function(d, i){return colors[d.y];});

	// add text to every rect dependend on data
	bar.append("text")
		.attr("x", function(d) {
			if (x(d.x)){
				return x(d.x) + textSize - 30;
			}
			else{
				return textSize;
			}
		})
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.text(function(d){
			if (d.x){
				return d.x.toFixed(1);
			}
			else {
				return "No data availible"
			}
		});

	// add president name in front of rect 	
	bar.append("text")
		.attr("y", barHeight/2)
		.attr("dy", ".35em")
		.text(function(d){return d.y})
}