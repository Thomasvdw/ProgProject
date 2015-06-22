// Variables that are used in all d3 javascript files
d3.select("#USmap").on("click", drawUSmap);
d3.select("#Capacity").on("click", drawUSmap);
		
// Variables that are used in all d3 javascript files. 
var parseDate = d3.time.format("%d-%m-%Y").parse;
var dates = [parseDate("01-01-2000"), parseDate("01-01-2001"), parseDate("01-01-2002"),parseDate("01-01-2003"),
			parseDate("01-01-2004"), parseDate("01-01-2005"), parseDate("01-01-2006"), parseDate("01-01-2007"),
			parseDate("01-01-2008"), parseDate("01-01-2009"), parseDate("01-01-2010"), parseDate("01-01-2011"),
			parseDate("01-01-2012"), parseDate("01-01-2013"), parseDate("01-01-2014"), parseDate("01-01-2015")]
			
var state_ids = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

var state_names = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

var state_ids_to_names = {}

for (var n = 0; n < state_ids.length; n++){
	state_ids_to_names[state_ids[n]] = state_names[n];
}
		// Load data
		var q = queue(1);
		for (var i = 0; i < state_ids.length; i++){
			q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\solar_size\\solar_size_" + state_ids[i] + ".csv");
		}
		q.awaitAll(saveCapacityData);
		
		q = queue(1);
		for (var i = 0; i < state_ids.length; i++){
			q.defer(d3.csv, "\\Data\\PVdata\\normalized_costs_growth\\cost_per_size\\cost_per_size_" + state_ids[i] + ".csv");
		}
		q.awaitAll(saveCostsData);
		
		q = queue(1);
		for (var i = 0; i < state_ids.length; i++){
			q.defer(d3.csv, "\\Data\\PVdata\\annual_generated_kwh_growth\\generated_" + state_ids[i] + ".csv");
		}
		q.awaitAll(saveElectricityData);
		
		q = queue(1);
		for (var i = 0; i < state_ids.length; i++){
			q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\population_size\\" + state_ids[i] + "_population.csv");
		}
		q.awaitAll(savePopulationData);
		
		// drawn = 1 when a graph has been drawn, 0 when this is not the case. (only for line-graph)
		var drawn = 0;
			
		// Variables to store the loaded data in. 
		var CapacityData;
		var CostsData;
		var ElectricityData;
		var PopulationData;
		
		function saveCapacityData(errors, Data){
			CapacityData = Data;
			return CapacityData;
		}
		
		function saveCostsData(errors, Data){
			CostsData = Data;
			return CostsData;
		}
		
		function saveElectricityData(errors, Data){
			ElectricityData = Data;
			return ElectricityData;
		}
		
		function savePopulationData(errors, Data){
			PopulationData = Data;
			return PopulationData;
		}
		
		function drawElectricityLine(){
			
			drawn = 0;
			
			var svg = d3.selectAll("svg").remove()
			d3.selectAll("#third_dropdown").remove()
			d3.selectAll("#title").remove()
			d3.selectAll("#graph-title").append("hr")
					.attr("id", "title")
					.attr("class", "col-lg-10 text-center")
					.style("margin-left", "5%")
			d3.selectAll("#graph-title").append("h3")
					.attr("id", "title")
					.attr("class", "col-lg-12 text-center")
					.text("Line graph of PV-generated electricity per capita")
					
			var container = d3.selectAll("#graph-title")
			var third_dropdown = container.append("div")
				.attr("id", "third_dropdown");
			var dropdown = third_dropdown.append("div")
				.attr("class", "dropdown");
			var button = dropdown.append("button")
				.attr("class", "btn btn-default dropdown-toggle")
				.attr("type", "button")
				.attr("id", "menu1")
				.attr("data-toggle", "dropdown")
				.text("Select State ")
				.append("span")
				.attr("class", "caret");
			var ul = dropdown.append("ul")
				.attr("class", "dropdown-menu")
				.attr("role", "menu")
				.attr("aria-labelledby", "menu1")

			for (var i = 0; i < state_ids.length; i++){
				var li = ul.append("li")
					.attr("role", "presentation")
					.append("a")
					.attr("id", state_ids[i])
					.on("click", function(){
						drawSelectedState(this.id, ElectricityData, "electricity");})
					.attr("role", "menuitem")
					.attr("tabindex", "-1")
					.attr("href", "#" + state_ids[i])
					.text(state_ids_to_names[state_ids[i]]);
			}
			
			$(".dropdown-menu li a").click(function(){
				$(this).parents("#third_dropdown").find('.btn').text($(this).text());
				$(this).parents("#third_dropdown").find('.btn').val($(this).text());
			});
			
			drawSelectedState("AL", ElectricityData, "electricity")
			
		}
		function drawCostsLine(){

			drawn = 0;
			
			var svg = d3.selectAll("svg").remove()
			d3.selectAll("#third_dropdown").remove()
			d3.selectAll("#title").remove()
			d3.selectAll("#graph-title").append("hr")
					.attr("id", "title")
					.attr("class", "col-lg-10 text-center")
					.style("margin-left", "5%")
			d3.selectAll("#graph-title").append("h3")
					.attr("id", "title")
					.attr("class", "col-lg-12 text-center")
					.text("Line graph of costs of PV-panels per kW per state")

			
			var container = d3.selectAll("#graph-title")
			var third_dropdown = container.append("div")
				.attr("id", "third_dropdown");
			var dropdown = third_dropdown.append("div")
				.attr("class", "dropdown");
			var button = dropdown.append("button")
				.attr("class", "btn btn-default dropdown-toggle")
				.attr("type", "button")
				.attr("id", "menu1")
				.attr("data-toggle", "dropdown")
				.text("Select State ")
				.append("span")
				.attr("class", "caret");
			var ul = dropdown.append("ul")
				.attr("class", "dropdown-menu")
				.attr("role", "menu")
				.attr("aria-labelledby", "menu1")

			for (var i = 0; i < state_ids.length; i++){
				var li = ul.append("li")
					.attr("role", "presentation")
					.append("a")
					.attr("id", state_ids[i])
					.on("click", function(){
						drawSelectedState(this.id, CostsData, "costs");})
					.attr("role", "menuitem")
					.attr("tabindex", "-1")
					.attr("href", "#" + state_ids[i])
					.text(state_ids_to_names[state_ids[i]]);
			}
			
			$(".dropdown-menu li a").click(function(){
				$(this).parents("#third_dropdown").find('.btn').text($(this).text());
				$(this).parents("#third_dropdown").find('.btn').val($(this).text());
			});
			
			drawSelectedState("AL", CostsData, "costs")
		}
		function drawCapacityLine(){
			
			drawn = 0;
			
			var svg = d3.selectAll("svg").remove()
			d3.selectAll("#third_dropdown").remove()
			d3.selectAll("#title").remove()
			d3.selectAll("#graph-title").append("hr")
					.attr("id", "title")
					.attr("class", "col-lg-10 text-center")
					.style("margin-left", "5%")
			d3.selectAll("#graph-title").append("h3")
					.attr("id", "title")
					.attr("class", "col-lg-12 text-center")
					.text("Line of PV-generated electricity per capita")				

			
			var container = d3.selectAll("#graph-title");
			
			var third_dropdown = container.append("div")
				.attr("id", "third_dropdown");
			var dropdown = third_dropdown.append("div")
				.attr("class", "dropdown");
			var button = dropdown.append("button")
				.attr("class", "btn btn-default dropdown-toggle")
				.attr("type", "button")
				.attr("id", "menu1")
				.attr("data-toggle", "dropdown")
				.text("Select State ")
				.append("span")
				.attr("class", "caret");
			var ul = dropdown.append("ul")
				.attr("class", "dropdown-menu")
				.attr("role", "menu")
				.attr("aria-labelledby", "menu1")

			for (var i = 0; i < state_ids.length; i++){
				var li = ul.append("li")
					.attr("role", "presentation")
					.append("a")
					.attr("id", state_ids[i])
					.on("click", function(){
						drawSelectedState(this.id, CapacityData, "capacity");})
					.attr("role", "menuitem")
					.attr("tabindex", "-1")
					.attr("href", "#" + state_ids[i])
					.text(state_ids_to_names[state_ids[i]]);
			}
			
			$(".dropdown-menu li a").click(function(){
				$(this).parents("#third_dropdown").find('.btn').text($(this).text());
				$(this).parents("#third_dropdown").find('.btn').val($(this).text());
			});
			
			drawSelectedState("AL", CapacityData, "capacity")
		}
		function drawSelectedState(state, Data, type){
			
			if (Data == undefined){
				svg = d3.selectAll("svg").remove()
				
				if (type == "costs"){
					setTimeout(function(){drawSelectedState(state, CostsData, type)}, 2500);
				}
				else if (type == "electricity"){
					setTimeout(function(){drawSelectedState(state, ElectricityData, type)}, 2500);
				}
				else {
					setTimeout(function(){drawSelectedState(state, CapacityData, type)}, 2500);
				}	
			}
			else {
						
			var svg = d3.selectAll("svg").remove()
			
			var selectedState = state;
							
			var margin = {top: 20, right: 80, bottom: 30, left: 50},
				width = 1160 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;
					
			var parseDate = d3.time.format("%d-%m-%Y").parse;
				bisectDate = d3.bisector(function(d) {return d.Date;}).left;
				
			var x = d3.time.scale()
				.range([75, width]);
					
			var y = d3.scale.linear()
				.range([height, 35]);
					
			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
				
			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				
			allSizes = {}
			populations = {}
			PopulationData.forEach(function(d, i){
				populations[state_ids[i]] = d;
			})
				
			Data.forEach(function(d, i) {
				allSizes[state_ids[i]] = d;
			});
				
			var line = d3.svg.line()
				.x(function(d) { 
					if (d.Date === null){
						d.Date = parseDate("01-01-2000");
						return x(d.Date);
					}
					return x(d.Date); })
				.y(function(d) { 
					if (type == "costs"){
						return y(d["Cost/size"]);
					}
					else if (type == "electricity"){
						return y(d["Annual generated"]);
					}
					else {
						return y(d.Size); 						
					}
				});
									
			var svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height + margin.bottom)
				.attr("class", "center-block");
			svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
			// allSizes contains following: allSizes[state code (2 letters)] = object of length 17 with for each the size and the date
				
			var getSizes = function(allSizes, state){
				return allSizes[state];
			}
			
			var selectedStateSizes = getSizes(allSizes, selectedState);
			
			// Put 2015 population per state in object
			statePopulation = {};
			for (var i = 0; i < state_ids.length; i++){
				statePopulation[state_ids[i]] = parseFloat(populations[state_ids[i]][34].Population)
				if (statePopulation[state_ids[i]] > 450){
					statePopulation[state_ids[i]] = statePopulation[state_ids[i]] / 1000;
				}
				statePopulation[state_ids[i]] = statePopulation[state_ids[i]] * 1000
			}
			
			for (var i = 0; i < state_ids.length; i++){
				stateSizes = getSizes(allSizes, state_ids[i]);
				stateData = [];		
				
				// Check here if stateSizes is NOT undefined
				stateSizes.forEach(function(d, j) {
						if (drawn == 0 && typeof d.Date == "string"){
						d.Date = d.Date.replace("1/1/", "01-01-");
						d.Date = parseDate(d.Date);
						}
						if (type == "costs"){
							d["Cost/size"] = parseFloat(d["Cost/size"]);
							if (d["Cost/size"] > 0 && d["Cost/size"] < 21000 && d.Date != null){
								stateData.push(d);
							}
						}
						else if (type == "electricity"){
							d["Annual generated"] = +d["Annual generated"];
							if (d["Annual generated"] > 0 && d.Date != null){
								if (drawn == 0){
									d["Annual generated"] = d["Annual generated"] / statePopulation[state_ids[i]]
								}
								stateData.push(d);
							}
						}
						else {
							d.Size = +d.Size;
							if (d.Size > 0 && d.Date != null){
								stateData.push(d);
							}
						}
				});
				
				// Configure axis for capacity graph
				if (type == "capacity"){
					x.domain(d3.extent(selectedStateSizes, function(d) { return d.Date }))
					y.domain(d3.extent(selectedStateSizes, function(d) { return d.Size; }));
				}
				if (type == "electricity"){
					x.domain(d3.extent(selectedStateSizes, function(d) { return d.Date; }));
					y.domain(d3.extent(selectedStateSizes, function(d) { return d["Annual generated"] / statePopulation[selectedState];	}));
				}
			
				// Configure axis for costs per kW graph
				if (type == "costs"){
					var extentArray = stateSizes.slice();
					var zero_object = {
						"Date": parseDate("01-01-2000"),
						"Cost/size": 0
					}
					var max_object = {
						"Date": parseDate("01-01-2000"),
						"Cost/size": 20000
					}
					extentArray.push(zero_object);
					extentArray.push(max_object);
					
					x.domain(d3.extent(stateSizes, function(d) { return d.Date; }));
					y.domain(d3.extent(extentArray, function(d) { return d["Cost/size"];}));
				}
				
				var path = svg.append("path")
					path.datum(stateData)
					path.attr("class", "line")
					path.attr("id", state_ids[i])
					path.attr("d", line)
					path.on("mousemove", function(d){
						d3.selectAll("#mouseover_state").remove()
						legend.append("text")
						.attr("id", "mouseover_state")
						.attr("x", (width / 2))
						.attr("y", 52)
						.attr("text-anchor", "middle") 
						.style("font-size", "13px") 
						.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
						.text("Select state: " + state_ids_to_names[this.id])
					})
					path.on("click", function(d){
						drawSelectedState(this.id, Data, type);
					})
					path.attr("stroke", "steelblue")
				if (state_ids[i] == selectedState){
					path.attr("stroke-width", "2.5px")
					path.attr("stroke", "red");
				}
				else {
					path.attr("stroke-width", "2px")
					path.attr("opacity", "0.5")
				}
			}
			drawn += 1;

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(35," + height +")")
				.call(xAxis);
					
			svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(75, 0)")
				.call(yAxis);
				
			var legend = svg.append("g")
				legend.append("rect")
					.attr("x", 73)
					.attr("y", 0)
					.attr("width", width - 75)
					.attr("height", 32)
					.attr("fill", "white")
				
				legend.append("rect")
					.attr("x", (width - 250) / 2)
					.attr("y", 32)
					.attr("width", 250)
					.attr("height", 32)
					.attr("fill", "white")
					
					
			legend.append("text")
				.attr("x", (width / 2))             
				.attr("y", 20)
				.attr("text-anchor", "middle")  
				.style("font-size", "16px") 
				.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
				.attr("font-style", "italic")
				.text(function(){
					if (type == "costs"){
						var end_size = allSizes[selectedState][0]["Cost/size"],		
							begin_size = allSizes[selectedState][15]["Cost/size"], 
							years = 15,
							growth = end_size - begin_size,
							annual_growth = parseFloat(growth) / years;
						
						var find_size = 15
						while (begin_size == 0){
							find_size -= 1;
							begin_size = allSizes[selectedState][find_size]["Cost/size"]
						}
						
						return state_ids_to_names[selectedState] + "'s average price per kW changed from " + begin_size + " $/kW to " + end_size + " $/kW in " + years + " years";
					}
					else if (type == "electricity"){
						return state_ids_to_names[selectedState] + " annual generated electricity compared to other states";
					}
					else {
						var end_size = allSizes[selectedState][0].Size,
							begin_size = allSizes[selectedState][15].Size,
							years = 15,
							growth = end_size - begin_size,
							annual_growth = parseFloat(growth) / years;
						return state_ids_to_names[selectedState] + "'s capacity grew from " + begin_size + " MW to " + end_size + " MW in " + years + " years, by " + String(annual_growth).substr(0,5) + " MW per year on average.";
					}
				})
			svg.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 86)
				.attr("x", -10)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text( function(){
						if (type == "costs"){
							return "Average price of solar panels ($ per kW)";
						}
						else if (type == "electricity"){
							return "Generated Electricity per capita per year (kWh)";
						}
						else {
							return "Total capacity (kW)"							
						}
				});
			

		}
		}
	