window.onload = function() {

	// build queue to load in data
 	var q = queue(1);
 	q.defer(d3.json, "us.json");
 	q.awaitAll(drawMap);
}


function drawMap(error, data){
	var mapData = data[0];
	var width = 900;
	var height= 600;
	// build svg element to hold map
	var svg = d3.select("#Map")

	// initialise projection of the map
	var projection = d3.geo.azimuthalEqualArea()
					.precision(.1)
					.scale(200)
					.translate([width / 3, height / 2]);
	
	// initialise path builder
	var path = d3.geo.path()
				// .projection(projection);

	// draw all landmaps one by one
 	svg.selectAll(".land")
 		.data(topojson.feature(mapData, mapData.objects.states).features)
 		.enter().append("path")
 			.attr("class", function(d){ return "land " + d.id;})
 			.attr("d", path)
 }