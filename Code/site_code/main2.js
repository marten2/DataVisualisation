
/* Loads data for statistics graph,
   then implements function to load graphs and 
   functionality in the page.*/
function loadgraph(){
	// use queue to make sure everything loads
	var q = queue();
	q.defer(d3.csv, "../../docs/prepared_data/Obama_data.csv");
	q.defer(d3.csv, "../../docs/prepared_data/Hillary_data.csv");
	q.awaitAll(makePage);
} 

/* Initialises building of graphs and 
	interactive buttons and checkboxes.*/
function makePage(error, data){

	// prepare date conversion
	var parseDate = d3.time.format("%Y/%m/%d").parse;
	
	// get list of different data types
	var data_types = Object.keys(data[0][0]);
	
	// convert data to usable form
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
	
	// initialise necassary for asigning data, colors and names

	var presidents = []
	for (i = 0; i < data.length; i++){
		presidents.push(data[i][0].speeker)
	}
	var color_list = ['rgb(228,26,28)','rgb(55,126,184)','rgb(77,175,74)','rgb(152,78,163)','rgb(255,127,0)','rgb(255,255,51)']
	
	// get names from the data
	var button_names = data_types.slice(3);
	
	// build buttons for all different data types
	d3.select("#button-holder")
		.selectAll("input")
		.data(button_names)
		.enter().append("input")
			.attr("class", "button")
			.attr("type", "button")
			.attr("value", function(d){return d})
			.on("click", function(d){
				
				// dislpay graph pertaining to specific dataset
				draw_graph(data_types[1], d, data, "#speech-graph", color_list);
			});

	// build checkboxes for highlighting certain graphs 
	d3.select("#check-box")
		.selectAll("input")
		.data(presidents)
		.enter().append("input")
			.attr("class", "checkbox")
			.attr("type", "checkbox")
			.attr("value", function(d){console.log(d); return d})
			.on("change", function(d, i){
				color = this.checked ? color_list[i] : "black";
				console.log(color, i)
				d3.select("." + d)
					.style("stroke", color) 
			})			

	// display graph of average sentence length
	draw_graph(data_types[1], data_types[3], data, "#speech-graph", color_list);
}