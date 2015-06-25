"use strict";

/* Loads data for statistics graph,
   then implements function to load graphs and 
   functionality in the page.*/
window.onload = function(){
	// use queue to make sure everything loads
	var q = queue();
	q.defer(d3.csv, "../../docs/prepared_data/Obama_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/Hillary_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/Edwards_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/Huckabee_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/McCain_data.csv");
	q.awaitAll(makePage);
} 

/* Initialises building of graphs and 
	interactive buttons and checkboxes.*/
function makePage(error, data){
	
	// get list of different data types
	var data_types = Object.keys(data[0][0]);
	var date = data_types[1];
	var average_data = parse_data(data, data_types, date)

	// build list of presidents and object linking color to president
	var presidents = [],
		color_list = ['rgb(27,158,119)','rgb(217,95,2)','rgb(117,112,179)','rgb(231,41,138)','rgb(230,171,2)'],
		colors = {};
	for (var i = 0; i < data.length; i++){
		presidents.push(data[i][0].speeker);
		colors[data[i][0].speeker] = color_list[i];
	}	
	
	// get names from the data
	var button_names = data_types.slice(3);
	
	var selected_data_type = data_types[3];
	// build buttons for all different data types
	d3.select("#button-holder")
		.selectAll("input")
		.data(button_names)
		.enter().append("input")
			.attr("class", "button btn btn-default btn-lg")
			.attr("type", "button")
			.attr("value", function(d){return d})
			.on("click", function(d){

				selected_data_type = d;
				// dislpay graph pertaining to specific dataset
				draw_graph_statistics(date, d, average_data, "#speech-graph", colors);
			});

	// build checkboxes for highlighting certain graphs 
	d3.select("#check-box")
		.selectAll(".checkbox")
		.data(presidents)
		.enter().append("div")
			.attr("class", "checkbox")
			.style("background-color", function(d){return colors[d];})
				.append("label")
				.text(function(d){return d})
				.append("input")
					.attr("class", function(d){return "selector " + d;})
					.attr("type", "checkbox")
					.attr("value", function(d){return d;})
					.attr("checked", true)
					.on("change", function(d, i){
						change_color_lines(d, i, colors, average_data, date, selected_data_type, this.checked);
					});			

	// call other visualisation_functions
	draw_graph_statistics(date, selected_data_type, average_data, "#speech-graph", colors);
	loadmap(data, data_types, button_names, colors);
	loadpolls(colors);
}

function parse_data(data, data_types, date){
	
	// prepare date conversion
	var parseDate = d3.time.format("%Y-%m-%d").parse;

	// implement output
	var average_data = [];

	// convert data to usable form and get averaged data per month
	data.forEach(function(file_data, j){
		average_data[j] = [];

		// initialise variables necessary to calculate month average
		var begin_date = parseDate(file_data[0][date]),
			month = begin_date.getMonth(),
			data_month = new Object,
			total_month = 0,
			data_entry = new Object,
			speaker = file_data[0][data_types[0]];

		// initialise values on zero, taking only the different data dimensions
		for (var i = 3; i < data_types.length; i++)
		{
			data_month[data_types[i]] = 0;
		} 

		file_data.forEach(function(d){
			// change time to time objects
			d[date] = parseDate(d[date]);

			// calculate average of data per month
			if (month != d[date].getMonth()){
				data_entry[data_types[0]] = speaker;
				// get first day of the month
				data_entry[date] = new Date(begin_date.getFullYear(), begin_date.getMonth(), 1);
				
				// calculate average data in the month (data entries are 3 and above)
				for (var k = 3; k < data_types.length; k++)
				{
					data_entry[data_types[k]] = data_month[data_types[k]]/total_month; 
					data_month[data_types[k]] = 0;
				}

				// save data and reset temp variables for next month
				average_data[j].push(data_entry);
				total_month = 0;
				begin_date = d[date];
				month = d[date].getMonth();
				data_entry = new Object;
			}
			
			// parse data to numbers and save data per month
			for (var i = 3; i < data_types.length; i++) {
				d[data_types[i]] = Number(d[data_types[i]]);
				data_month[data_types[i]] = data_month[data_types[i]] + d[data_types[i]];
			}
			
			// get total data entries in a month
			total_month++;
		});
		
		// save last months data entry
		data_entry[date] = new Date(begin_date.getFullYear(), begin_date.getMonth(), 1);
		data_entry[data_types[0]] = speaker;
		for (var k = 3; k < data_types.length; k++)
		{
			data_entry[data_types[k]] = data_month[data_types[k]]/total_month; 
		}
		average_data[j].push(data_entry);
	});
	return average_data;
}

function change_color_lines(d , i, colors, data, x_name, y_name, checked){	
	/*change color to gray or coresponding color if checkbox changes
	  redrawing speech line as highest colored, or lowest gray line.*/

	// change color of lines					
	var color = checked ? colors[d] : "rgb(200, 200, 200)";
	d3.selectAll(".line." + d)
		.style("stroke", color);

	// get svg dimensions
 	var svg = d3.select("#speech-graph"),
	svg_width = svg.style("width")
					.match(/\d/g)
					.join(""),
	svg_height = svg.style("height")
					.match(/\d/g)
					.join("");
	
	var margin = {left : 40, right: 30, top: 10, bottom: 40},
		width = svg_width - margin.left - margin.right,
		height = svg_height - margin.top - margin.bottom;

	// remove old line
	svg.select(".line." + d).remove();


	// get x and y trans
	var xtrans = get_xTrans(x_name, data, width);
	var ytrans = get_yTrans(y_name, data, height); 

	// prepare line
	var line = d3.svg.area()
 				.x(function(l){return xtrans(l[x_name]);})
 				.y(function(l){return ytrans(l[y_name]);})
 				.interpolate('step-after');

 	draw_line(checked, data[i], d, line, colors);
}