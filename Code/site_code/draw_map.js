function loadmap(data, data_types, button_names, color_list) {
	// build queue to load in data
 	var q = queue(1);
 	q.defer(d3.json, "us.json");
 	q.defer(d3.csv, "usstates.csv")
 	q.awaitAll(function(error, mapData){
 		drawMap(data, mapData, data_types, button_names, color_list);
 	});
}

function drawMap(data, map_data, data_types, button_names, color_list){
	// seperate files
	var mapData = map_data[0];
	var stateData = map_data[1];
	
	// build svg element to hold map
	var svg = d3.select("#Map");
	
	// initialise path builder
	var path = d3.geo.path();

	// initialise base selector of graph to display before user selects something
	var display = data_types[3];
	var state = "California";

	// build a set of buttons to switch between datasets
	d3.select("#select-box")
		.selectAll("input")
		.data(button_names)
		.enter().append("input")
			.attr("class", function(d){return "btn btn-default btn-md selector2 " + d;})
			.attr("type", "button")
			.attr("value", function(d){return d;})
			.on("click", function(d, i){
				display = d;
				make_barchart(display, "speeker", data, "#Map-graph", state, color_list);
		});

	// draw all lands 
 	svg.selectAll(".land")
 		.data(topojson.feature(mapData, mapData.objects.states).features)
 		.enter().append("path")
 			.attr("class", function(d){ 
 				// get specifick name of state using number id
 				for (i = 0; i < stateData.length; i++) {
 					if (Number(d.id) === Number(stateData[i].id)){
 						return "land " + stateData[i].name
 					}
 				}
 				return "land"

 			})
 			.on("click", function(d){
 				
 				// find state name and drawbarchart dependen on state name
 				for (i = 0; i < stateData.length; i++) {
 					if (Number(d.id) === Number(stateData[i].id)){
 						state = stateData[i].name;
 						make_barchart(display, "speeker", data, "#Map-graph", state, color_list);
						break;		
 					}
 				}
 				
 				// collor state using selland class
 				d3.selectAll(".land").classed("selland", false)
 				d3.select(d3.event.target).classed("selland", true)
 			})
 			.attr("d", path);
}
