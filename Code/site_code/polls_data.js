function loadpolls(colors){	
	// load in data for polls graph
	q = queue(1);
	q.defer(d3.csv, "../../docs/prepared_data/pres_dem_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/pres_rep_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/pres_pres_data.csv");
	q.awaitAll(function(error, data){
		drawPollsGraph(data, colors);
	});
}
function drawPollsGraph(data, colors){
	/* changes data to usable format and draws a graph of the data*/

	// initialise variables for parsing data and to get range of data
	var parseDate = d3.time.format("%m/%d/%Y").parse,
		keys = [],
		sorted_data = new Object,
		max_rating = 0,
		min_rating  = Infinity,
		max_date = -Infinity,
		min_date = Infinity;

	// parse data in usable format, object of lists per president
	data.forEach(function(file_data, i){

		// get keys of presidents for output object
		var temp_keys = Object.keys(file_data[0]);
		var temp = temp_keys.concat(keys);
		keys = temp.filter(function (item, pos){return temp.indexOf(item) == pos});
		
		// get key for date to get out of object
		var date = keys[0];

		// prepare list to fill for every key in object
		for (j = 1; j < keys.length; j++)
		{
			if(!sorted_data[keys[j]])
			{
				sorted_data[keys[j]] = [];
			}
		}
		// fill lists with data
		file_data.forEach(function(d){
			d[date] = parseDate(d[date]);

			// get range of time
			if (d[date].getTime() > max_date){max_date = d[date].getTime();}
			else if (d[date].getTime() < min_date){min_date = d[date].getTime();}

			// parse polls data and save in right list of objecst
			for (k = 1; k < keys.length; k++){

				// - in data equals 0 in numbers
				if (d[keys[k]] === "-"){d[keys[k]] = 0}
				
				// make number of data
				d[keys[k]] = +d[keys[k]];

				// get range in polls data
				if (d[keys[k]] > max_rating) {max_rating = d[keys[k]];}
				else if (d[keys[k]] < min_rating) {min_rating = d[keys[k]];}
				
				// if rightly parsed save data
				if(d[keys[k]])
				{
					sorted_data[keys[k]].push([d[date], d[keys[k]]]);
				}
			} 	
		});
	});

	// sort data on dates for good continuous line
	for (i = 1; i < keys.length; i++)
	{
		sorted_data[keys[i]].sort(function(a, b){return a[0].getTime() - b[0].getTime()})
	}

	// get svg dimensions and graph dimensions
	var svg = d3.select("#pop-graph");
	svg_width = svg.style("width")
					.match(/\d/g)
					.join(""),
	svg_height = svg.style("height")
					.match(/\d/g)
					.join("");

	var margin = {left : 40, right: 30, top: 10, bottom: 40},
		width = svg_width - margin.left - margin.right,
		height = svg_height - margin.top - margin.bottom; 	
 	
	// prepare holder for graph
 	svg = svg.append("g")
 			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 	
 	// initialise transformation from data to pixels
 	var xtrans = d3.time.scale()
 					.range([0, width])
 					.domain([min_date,max_date]);
 	
 	var ytrans = d3.scale.linear()
 					.range([height, 0])
 					.domain([min_rating, max_rating]);

 	
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
			.text("Datum")
			.attr("x", width - 100)
			.attr("dy", - 10);

	// add y axis to svg
	svg.append("g")
		.attr("class", "y-axis axis")
		.call(yAxis)
		.append("text")
			.attr("class", "text")
			.text("Opiniepeiling")
			.attr("x", -120)
			.attr("dy", 15)
			.attr("transform", "rotate(-90)");
	
	// prepare line generator
	var line = d3.svg.line()
	 				.x(function(d){return xtrans(d[0]);})
	 				.y(function(d){return ytrans(d[1]);});
	
	// build line for every candidate, skipping first date key
	for (i = 1; i < keys.length; i++)
	{
		svg.append("path")
		.datum(sorted_data[keys[i]])
		.attr("class", function(d){return "line " + keys[i]})
		.style("stroke", colors[keys[i]])
		.attr("d", line);
	}
}
