function loadpage(){
	queue()
		.defer(d3.csv, "../../docs/prepared_data/Obama_data.csv")
		.defer(d3.csv, "../../docs/prepared_data/Hillary_data.csv")
		.await(makePage);
} 
function makePage(error, data){
	var parseDate = d3.time.format("%Y/%m/%d").parse;
	
	// get list of different data types
	var data_types = Object.keys(data[0][0]);
	
	data.forEach(function(d){
		d.forEach(function(d){ 
			// change time to time objects
			d[data_types[1]] = parseDate(d[data_types[1]]);
			
			// change all data to numbers
			for (i = 3; i < data_types.length; i++) {
				d[data_types[i]] = Number(d[data_types[i]]);
			}
		});
	});

	var button_names = data_types.slice(3);
	d3.select("#button-holder")
		.selectAll("input")
		.data(button_names)
		.enter().append("input")
			.attr("class", "button")
			.attr("type", "button")
			.attr("value", function(d){return d})
			.on("click", function(d){
				draw_graph(data_types[1], d, data, "#speech-graph");
				draw_graph(data_types[1], d, data, "#speech-graph");
			});

	draw_graph(data_types[1], data_types[3], data, "#speech-graph");
}