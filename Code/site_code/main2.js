/* Loads data for statistics graph,
   then implements function to load graphs and 
   functionality in the page.*/
function loadgraph(){
	// use queue to make sure everything loads
	var q = queue();
	q.defer(d3.csv, "../../docs/prepared_data/Obama_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/Hillary_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/Edwards_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/Huckabee_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/McCain_data.csv");
	q.awaitAll(makePage);
} 
function parse_data(data, data_types, date){
	// prepare date conversion
	var parseDate = d3.time.format("%Y/%m/%d").parse;

	var average_data = [],
		month = "",
		average_month = new Object,
		total_month = 0
		begin_date = new Date()
		data_point = new Object;
	for (i = 3; i < data_types.length; i++)
	{
		average_month[data_types[i]] = 0;
		data_point[data_types[i]] = 0;
	} 
	// convert data to usable form
	data.forEach(function(d, j){
		average_data[j] = []
		begin_date = parseDate(d[0][date])
		month = begin_date.getMonth() 
		d.forEach(function(d){ 
			// change time to time objects
			d[date] = parseDate(d[date]);
			if (month != d[date].getMonth()){
				data_point[date] = begin_date;
				data_point[data_types[0]] = d[data_types[0]];
				for (k = 3; k < data_types.length; k++)
				{
					data_point[data_types[k]] = average_month[data_types[k]]/total_month; 
					average_month[data_types[k]] = 0;
				}
				total_month = 0;
				average_data[j].push(data_point);
				begin_date = d[date];
				month = d[date].getMonth();
				data_point = new Object;
				
			}
			// change all data to numbers
			for (i = 3; i < data_types.length; i++) {
				d[data_types[i]] = Number(d[data_types[i]]);
				average_month[data_types[i]] = average_month[data_types[i]] + d[data_types[i]];
			}
			total_month++;
		});

	});
	return average_data;
}

/* Initialises building of graphs and 
	interactive buttons and checkboxes.*/
function makePage(error, data){
	
	// get list of different data types
	var data_types = Object.keys(data[0][0]);
	var date = data_types[1];
	var average_data = parse_data(data, data_types, date)

	// initialise necassary for asigning data, colors and names
	var presidents = []
	var color_list = ['rgb(27,158,119)','rgb(217,95,2)','rgb(117,112,179)','rgb(231,41,138)','rgb(102,166,30)']
	colors = {}
	for (i = 0; i < data.length; i++){
		presidents.push(data[i][0].speeker);
		colors[data[i][0].speeker] = color_list[i];
	}	
	
	// get names from the data
	var button_names = data_types.slice(3);
	
	// build buttons for all different data types
	d3.select("#button-holder")
		.selectAll("input")
		.data(button_names)
		.enter().append("input")
			.attr("class", "button btn btn-default btn-lg")
			.attr("type", "button")
			.attr("value", function(d){return d})
			.on("click", function(d){

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
						color = this.checked ? colors[d] : "rgb(200, 200, 200)";
						d3.selectAll(".line." + d)
							.style("stroke", color) 
					});			

	// display graph of average sentence length
	draw_graph_statistics(date, data_types[3], average_data, "#speech-graph", colors);
	loadmap(data, data_types, button_names, colors);
	loadpolls(colors);
}