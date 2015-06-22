function loadpolls(colors){	
	q = queue(1);
	q.defer(d3.csv, "../../docs/prepared_data/pres_dem_data.csv")
	q.defer(d3.csv, "../../docs/prepared_data/pres_rep_data.csv")
	q.defer(d3.csv, "../../docs/prepared_data/pres_pres_data.csv")
	q.awaitAll(function(error, data){drawPollsGraph(data, colors)})
}
function drawPollsGraph(data, colors){
	var parseDate = d3.time.format("%m/%d/%Y").parse,
	keys = [],
	sorted_data = new Object,
	max_rating = 0,
	min_rating  = Infinity,
	max_date = -Infinity;
	min_date = Infinity;
	data.forEach(function(file_data, i){
		var temp_keys = Object.keys(file_data[0]);
		var temp = temp_keys.concat(keys);
		keys = temp.filter(function (item, pos){return temp.indexOf(item) == pos});
		date = keys[0]
		for (j = 1; j < keys.length; j++)
		{
			if(!sorted_data[keys[j]])
			{
				sorted_data[keys[j]] = []
			}
		}
		file_data.forEach(function(d){
			d[date] = parseDate(d[date]);
			if (d[date].getTime() > max_date){max_date = d[date].getTime();}
			else if (d[date].getTime() < min_date){min_date = d[date].getTime();}

			for (k = 1; k < keys.length; k++){
				if (d[keys[k]] === "-"){d[keys[k]] = 0}
				d[keys[k]] = +d[keys[k]];
				if (d[keys[k]] > max_rating) {max_rating = d[keys[k]];}
				else if (d[keys[k]] < min_rating) {min_rating = d[keys[k]];}
				
				if(d[keys[k]])
				{
					sorted_data[keys[k]].push([d[date], d[keys[k]]]);
				}
			} 	
		});
	});

	for (i = 1; i < keys.length; i++)
	{
		sorted_data[keys[i]].sort(function(a, b){return a[0].getTime() - b[0].getTime()})
	}

	var svg = d3.select("#pop-graph");
	svg_width = svg.style("width")
					.match(/\d/g)
					.join(""),
	svg_height = svg.style("height")
					.match(/\d/g)
					.join("");
	// prepare holder for graph in the svg element
	var margin = {left : 40, right: 30, top: 10, bottom: 40},
		width = svg_width - margin.left - margin.right,
		height = svg_height - margin.top - margin.bottom; 	
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
			.text("Date")
			.attr("x", width - 100)
			.attr("dy", - 10);

	// add y axis to svg
	svg.append("g")
		.attr("class", "y-axis axis")
		.call(yAxis)
		.append("text")
			.attr("class", "text")
			.text("Ratings")
			.attr("x", -120)
			.attr("dy", 15)
			.attr("transform", "rotate(-90)");
	
	// prepare line generator
	var line = d3.svg.line()
	 				.x(function(d){return xtrans(d[0]);})
	 				.y(function(d){return ytrans(d[1]);});

	for (i = 1; i < keys.length; i++)
	{
		svg.append("path")
		.datum(sorted_data[keys[i]])
		.attr("class", function(d){return "line " + keys[i]})
		.style("stroke", colors[keys[i]])
		.attr("d", line);
	}
}
