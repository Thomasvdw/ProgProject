
var state_ids = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

var state_names = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

var state_ids_to_names = {}

for (var n = 0; n < state_ids.length; n++){
	state_ids_to_names[state_ids[n]] = state_names[n];
}
		
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
		
		// drawn = 1 when a graph has been drawn, 0 when this is not the case. (only //for line-graph)
		var drawn = 0;
			
		// Variables to store the loaded data in. 
		var CapacityData;
		var CostsData;
		var ElectricityData;
		
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
		
		function drawCapacityLine(){
			
			drawn = 0;
			
			d3.selectAll("#third_dropdown").remove();
			d3.selectAll("svg").remove();
			
			var container = d3.selectAll("#content");
			
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
					.text(state_ids[i]);
			}
		}
		
		function drawSelectedState(state, Data, type){
						
			var svg = d3.selectAll("svg").remove()
			
			var selectedState = state;
							
			var margin = {top: 20, right: 80, bottom: 30, left: 50},
				width = 1160 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;
					
			var parseDate = d3.time.format("%d-%m-%Y").parse;
				
			var x = d3.time.scale()
				.range([75, width]);
					
			var y = d3.scale.linear()
				.range([height, 35]);
					
			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
				
			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
				
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
				
			svg.append("text")
				.attr("x", (width / 2))             
				.attr("y", 20)
				.attr("text-anchor", "middle")  
				.style("font-size", "16px") 
				.text(state_ids_to_names[selectedState] + " capacity growth compared to other states");
				
			allSizes = {}
				
			Data.forEach(function(d, i) {
				allSizes[state_ids[i]] = d
			});
				
			// allSizes contains following: allSizes[state code (2 letters)] = object of length 17 with for each the size and the date
				
			var getSizes = function(allSizes, state){
				return allSizes[state];
			}
			
			var selectedStateSizes = getSizes(allSizes, selectedState);
			
				
			for (var i = 0; i < state_ids.length; i++){
				stateSizes = getSizes(allSizes, state_ids[i]);
				
				stateSizes.forEach(function(d) {
					if (drawn == 0){
						d.Date = d.Date.replace("1/1/", "01-01-");
						d.Date = parseDate(d.Date);
						if (type == "costs"){
							d["Cost/size"] = +d["Cost/size"];
						}
						else if (type == "electricity"){
							d["Annual generated"] = +d["Annual generated"];
						}
						else {
							d.Size = +d.Size;
						}
					}
				})
			
				if (type == "capacity"){
					x.domain(d3.extent(selectedStateSizes, function(d) { return d.Date }))
					y.domain(d3.extent(selectedStateSizes, function(d) { return d.Size; }));
				}
				if (type == "electricity"){
					x.domain(d3.extent(selectedStateSizes, function(d) { return d.Date; }));
					y.domain(d3.extent(selectedStateSizes, function(d) { return d["Annual generated"]; }));
				}
				
			
				// Configure axis for costs per kW graph
				var extentArray = stateSizes;
				
				if (type == "costs"){
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
					path.datum(stateSizes)
					path.attr("class", "line")
					path.transition()
					path.attr("d", line)
					path.attr("stroke", "steelblue")
				if (state_ids[i] == selectedState){
					path.attr("stroke-width", "2.5px");
				}
				else {
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
							return "Generated Electricity per year (kWh)";
						}
						else {
							return "Total capacity (kW)"							
						}
				});
		}
	