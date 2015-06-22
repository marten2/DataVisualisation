function make_barchart(x_data, y_data, data, svg_selection, state, colors){
	var svg = d3.select(svg_selection)
	var margin = {left : 50, right: 10, top: 40, bottom: 40},
		width = 700 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	svg.selectAll("*").remove();
	svg.append("text")
		.attr("y", margin.top/2)
		.attr("x", margin.left)
		.attr("dy", ".35em")
		.text(state + ", " + x_data)

	svg = svg.append("g")
 			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 	
 	// initialise transformation from data to pixels
 	var state_data = []
 	var max = 0
 	data.forEach(function(dataset, i){
 		var j = 0
 		state_data[i] = new Object;
 		state_data[i].x = 0;
 		dataset.forEach(function(d){
 			if (d[x_data] > max){max = d[x_data]}
 			if (d.title === state){
 				state_data[i].x = state_data[i].x + d[x_data];
 				j++;
 			}
 		});
 		state_data[i].y = dataset[0][y_data];
 		state_data[i].x = state_data[i].x/j;
 	});

	var x = d3.scale.linear()
		.domain([0, max])
		.range([0, width]);

	var textSize = 70;
	var barHeight = 20;
	var bar = svg.selectAll("g")
		.data(state_data)
		.enter().append("g")
			.attr("transform" , function(d, i){return"translate(0, " + i * barHeight + ")";});

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
			else{
				return "No data availible"
			}
		});
	bar.append("text")
		.attr("y", barHeight/2)
		.attr("dy", ".35em")
		.text(function(d){return d.y})
 	// svg.selectAll("rect")
 	// 	.data(state_data)
 	// 	.enter().append("rect")
 	// 		.style("height", "20px")
 	// 		.style("width", function(d){ return String(x(d.x)) + "px";})
 	// 		.text(function(d){return d.y});
}