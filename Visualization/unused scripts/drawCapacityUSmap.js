// Draw map of capacity growth, after loading the capacity growth data. 
function drawUSmap(){
	var svg = d3.selectAll("svg").remove()
	d3.selectAll("#third_dropdown").remove()
	d3.selectAll("#title").remove()
	d3.selectAll("#graph-title").append("hr")
			.attr("id", "title")
			.attr("class", "col-lg-10 text-center")
			.style("margin-left", "9%")
	d3.selectAll("#graph-title").append("h3")
			.attr("id", "title")
			.attr("class", "col-lg-12 text-center")
			.text("Visualization of total capacity of PV's per state")


	
	var q = queue(1);
	for (var i = 0; i < state_ids.length; i++){
		q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\solar_size\\solar_size_" + state_ids[i] + ".csv");
		q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\population_size\\" + state_ids[i] + "_population.csv");
	}
	q.awaitAll(drawMap);
			
	function drawMap(errors,allData){	
	// Draw albersUsa projection on svg. 
	var width = 1160,
		height = 500;
				
	var projection = d3.geo.albersUsa()
		.scale(900)
		.translate([width / 2 + 50, (height - 80) / 2]);

	var path = d3.geo.path()
		.projection(projection);
			
	var x = d3.time.scale()
		.range([100,160])
		.domain(dates);
				
	var xAxis = d3.svg.axis()
		.scale(x)
		.tickValues(dates)
		.orient("bottom");

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "center-block");
			
	// Insert rectangle to show data in. 
	var data_reference = svg.insert("g");
		data_reference.append("rect")
			.attr("x", 120)
			.attr("y", 30)
			.attr("width", 150)
			.attr("height", 230)
			.attr("stroke", "black")
			.attr("fill", "transparent")
		data_reference.append("text")
			.text("Legend & data")
			.attr("x", 121)
			.attr("y", 22)
			.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
			.attr("font-size", "16");
		// Add buttons for pause, play, reset
		data_reference.append("svg:image")
			.attr("class", "pause-button")
			.attr("x", 230)
			.attr("y", 270)
			.attr("width", 30)
			.attr("height", 29)
			.attr("xlink:href", "images/pause.png");
		data_reference.append("svg:image")
			.attr("class", "reset-button")
			.attr("x", 130)
			.attr("y", 270)
			.attr("width", 30)
			.attr("height", 29)
			.attr("xlink:href", "images/previous.png");
		data_reference.append("svg:image")
			.attr("class", "play-button")
			.attr("x", 180)
			.attr("y", 270)
			.attr("width", 30)
			.attr("height", 29)
			.attr("xlink:href", "images/play.png");
		
		// Add legend explanation
		var texts = ["Year: ", "State: ", "Capacity: ", "Population: "];		
		for (var j = 0; j < texts.length; j++){
			data_reference.append("text")
				.attr("class", "legend_text")
				.text(texts[j])
				.attr("x", 125)
				.attr("y", 45 + 23 * j)
				.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
				.attr("font-size", "10");
		}
		
		// Add color bins to legend
		var colors = ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"]
		var colors_legend = ["0 MW:","1 - 99 MW:", "100 - 999 MW:", "1000 - 9999 MW:", "10.000 - 99.999 MW:", "100.000+ MW:"]
		for (var i = 0; i < colors.length; i++){
			data_reference.append("text")
				.attr("class", "legend")
				.text(colors_legend[i])
				.attr("x", 125)
				.attr("y", 135 + 20 * i)
				.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
				.attr("font-size", "10");
			data_reference.append("rect")
				.attr("class", "legend")
				.attr("x", 230)
				.attr("y", 127 + 20 * i)
				.attr("width", 10)
				.attr("height", 10)
				.attr("stroke", "black")
				.attr("fill", colors[i]);		
		}
			
	// Insert rectangle to point to current shown year
	var current_date_rect = svg.insert("g");
		current_date_rect.append("rect")
			.attr("class", "date_rect")
			.attr("x", 95)
			.attr("y", 435)
			.attr("width", 10)
			.attr("height", 10)
			.attr("stroke", "black")
			.attr("fill", "green")	
					
			
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0,450)")
		.call(xAxis);
			
	// Load path data to draw US states
	d3.json("us.json", function(unitedState) {
		var data = topojson.feature(unitedState, unitedState.objects.states).features;
		
		// List of names connected to ids
		d3.csv("us-state-names.csv", function(csv){
			var nameCodes = {};
			var fullNames = {};
			var nameSize = {};
			var namePopulation = {};
			var sizes = []
			var x = 0;
			csv.forEach(function(d,i){
				fullNames[d.id] = d.name;
				nameCodes[d.id] = d.code;
				nameSize[d.code] = allData[x];
				namePopulation[d.code] = allData[x + 1];
				sizes.push(allData[x]);
				x += 2;	
			});
		
		setTimeout(recolor, 100);	
		
		// Initialize starting values, use to find right data points
		var startSize = 15;
		var startDate = 21;
		var startRect = 95;
		var stepRect = 60;
				
		d3.selectAll(".pause-button")
			.on("click", pause);
					
		d3.selectAll(".reset-button")
			.on("click", reset_recolor);
				
		d3.selectAll(".play-button")
			.on("click", play_recolor);
					
		var pause_clicked = 0;
				
		function pause(){
			pause_clicked += 1;
		}
				
		function play_recolor(){
			if (pause_clicked % 2 == 0){
				recolor();
				clearTimeout();
				setTimeout(play_recolor, 2500);
			}
			if (pause_clicked == 1){
				pause_clicked = 0;
			}
		}
				
		function reset_recolor(){
			startSize = 15;
			startDate = 21;
			recolor();			
		}
				
		function recolor(){	
			if (startSize >= 0){
				// Adjust year-point rectangle
				d3.selectAll(".date_rect")
					.transition()
					.duration(500)
					.attr("x", startRect + (stepRect * (15 - startSize)));
				
				// Draw US states
				svg.append("g")
					.attr("class", "states-bundle")
					.selectAll("path")
					.data(data)
					.enter()
					.append("path")
					.attr("d", path)
					.on("mouseover", function(d) {		
						// Function to show data of state that the mouse is moving over
						d3.selectAll(".text").remove()
							
						var size = parseFloat(nameSize[nameCodes[d.id]][startSize].Size);
						var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population);
						
						// Adjust for mismatching data
						if (population > 450){
							population = population / 1000;
						}
						population = String(population).substr(0,5);
							
						var popup_texts = [nameSize[nameCodes[d.id]][startSize + 1].Date, fullNames[d.id], size + " MW", population + " mln"];
						for (var i = 0; i < popup_texts.length; i++){
							data_reference.append("text")
								.attr("class", "text")
								.text(popup_texts[i])
								.attr("x", 125 + 70)
								.attr("y", 45 + 23 * i)
								.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
								.attr("font-size", "10");
						}
					})
					.attr("stroke", "black")
					.attr("fill", function(d,i) {
						// Function to decide which color to use to fill each state
						if (nameSize[nameCodes[d.id]] != undefined){
							var size = parseFloat(nameSize[nameCodes[d.id]][startSize].Size);
							if (size == 0){
								return "#edf8fb"
							}
							if (size < 100){
								return "#ccece6" 
							}
							if (size < 1000){
								return "#99d8c9"
							}
							if (size < 10000){
								return "#66c2a4"
							}
							if (size < 100000){
								return "#2ca25f"
							}
							if (size < 1000000){
								return "#006d2c"
							}
						}
						return d3.interpolate("#edf8fb", "#006d2c")*0;
					});
					if (startSize != 0){
						startSize -= 1;
						startDate += 1;
						clearTimeout();
					}
				}
			}
			});
		});

		d3.select(self.frameElement).style("height", height + "px"); 
	};
	};
	// GO ON FROM HERE 23-6
function drawUSelectricitymap(){
			var svg = d3.selectAll("svg").remove()
			d3.selectAll("#third_dropdown").remove()
			d3.selectAll("#title").remove()
			d3.selectAll("#graph-title").append("hr")
					.attr("id", "title")
					.attr("class", "col-lg-10 text-center")
					.style("margin-left", "9%")
			d3.selectAll("#graph-title").append("h3")
					.attr("id", "title")
					.attr("class", "col-lg-12 text-center")
					.text("Visualization of PV-generated electricity per capita")	

	
			var q = queue(1);
			for (var i = 0; i < state_ids.length; i++){
				q.defer(d3.csv, "\\Data\\PVdata\\annual_generated_kwh_growth\\generated_" + state_ids[i] + ".csv");
				q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\population_size\\" + state_ids[i] + "_population.csv");
			}
			q.awaitAll(drawMap);
			
		function drawMap(errors,allData){	
		
			var width = 1160,
				height = 500;
				
			var projection = d3.geo.albersUsa()
				.scale(900)
				.translate([width / 2 + 50, (height - 80) / 2]);

			var path = d3.geo.path()
				.projection(projection);
			
			var x = d3.time.scale()
				.range([100,160])
				.domain(dates);
				
			var xAxis = d3.svg.axis()
				.scale(x)
				.tickValues(dates)
				.orient("bottom");

			var svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("class", "center-block");
			
			// insert rectangle to show data in, buttons, and legend title
			var data_reference = svg.insert("g");
				data_reference.append("rect")
					.attr("x", 120)
					.attr("y", 30)
					.attr("width", 150)
					.attr("height", 230)
					.attr("stroke", "black")
					.attr("fill", "transparent")
				data_reference.append("text")
					.text("Legend & data")
					.attr("x", 121)
					.attr("y", 22)
					.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
					.attr("font-size", "16");
				data_reference.append("svg:image")
					.attr("class", "pause-button")
					.attr("x", 230)
					.attr("y", 270)
					.attr("width", 30)
					.attr("height", 29)
					.attr("xlink:href", "images/pause.png");
				data_reference.append("svg:image")
					.attr("class", "reset-button")
					.attr("x", 130)
					.attr("y", 270)
					.attr("width", 30)
					.attr("height", 29)
					.attr("xlink:href", "images/previous.png");
				data_reference.append("svg:image")
					.attr("class", "play-button")
					.attr("x", 180)
					.attr("y", 270)
					.attr("width", 30)
					.attr("height", 29)
					.attr("xlink:href", "images/play.png");
					
				var texts = ["Year: ", "State: ", "Electricity p.p.: ", "Population"];
							
				for (var j = 0; j < texts.length; j++){
					data_reference.append("text")
						.attr("class", "legend_text")
						.text(texts[j])
						.attr("x", 125)
						.attr("y", 45 + 23 * j)
						.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
						.attr("font-size", "10");
				}

				var colors = ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"]
				
				// TODO: change these!
				var colors_legend = ["0 - 0.99 kWh:","1 - 4.99 kWh:", "5 - 9.99 kWh:", "10 - 49.99 kWh:", "50 - 99.99 kWh:", "100+ kWh:"]
				for (var i = 0; i < colors.length; i++){
					data_reference.append("text")
						.attr("class", "legend")
						.text(colors_legend[i])
						.attr("x", 125)
						.attr("y", 135 + 20 * i)
						.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
						.attr("font-size", "10");
					data_reference.append("rect")
						.attr("class", "legend")
						.attr("x", 230)
						.attr("y", 127 + 20 * i)
						.attr("width", 10)
						.attr("height", 10)
						.attr("stroke", "black")
						.attr("fill", colors[i]);
						
				}
				
			// Insert rectangle to point to current shown year
			var current_date_rect = svg.insert("g");
				current_date_rect.append("rect")
					.attr("class", "date_rect")
					.attr("x", 95)
					.attr("y", 435)
					.attr("width", 10)
					.attr("height", 10)
					.attr("stroke", "black")
					.attr("fill", "green")	
			
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0,450)")
				.call(xAxis);
			

			d3.json("us.json", function(unitedState) {
				var data = topojson.feature(unitedState, unitedState.objects.states).features;
		
				// List of names connected to ids
				d3.csv("us-state-names.csv", function(csv){
					var nameCodes = {};
					var fullNames = {};
					var nameSize = {};
					var namePopulation = {}
					var x = 0;
					csv.forEach(function(d,i){
						fullNames[d.id] = d.name;
						nameCodes[d.id] = d.code;
						nameSize[d.code] = allData[x];
						namePopulation[d.code] = allData[x + 1];
						x += 2;
					});
					
				setTimeout(recolor, 100);
				
				var startSize = 15;
				var startDate = 21;
				var startRect = 95;
				var stepRect = 60;

				d3.selectAll(".pause-button")
					.on("click", pause);
					
				d3.selectAll(".reset-button")
					.on("click", reset_recolor);
				
				d3.selectAll(".play-button")
					.on("click", play_recolor);
					
				var pause_clicked = 0;
				
				function pause(){
					pause_clicked += 1;
				}
				
				function play_recolor(){
					if (pause_clicked % 2 == 0){
						recolor();
						clearTimeout();
						setTimeout(play_recolor, 2500);
					}
					if (pause_clicked == 1){
						pause_clicked = 0;
					}
				}
				
				function reset_recolor(){
					startSize = 15;
					startDate = 21;
					recolor();			
				}
				
				function recolor(){
					
					if (startSize >= 0){
						
						d3.selectAll(".date_rect")
							.transition()
							.duration(500)
							.attr("x", startRect + (stepRect * (15 - startSize)));
					
						svg.append("g")
						.attr("class", "states-bundle")
						.selectAll("path")
						.data(data)
						.enter()
						.append("path")
						.attr("d", path)
						.on("mouseover", function(d) {
							d3.selectAll(".text").remove()
							
							var size = parseFloat(nameSize[nameCodes[d.id]][startSize]["Annual generated"])
							var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population)
							if (population > 450){
								population = population / 1000;
							}
							
							size = size / (population * 1000)
							
							size = String(size).substr(0,5);						
							population = String(population).substr(0,5);
							
							var popup_texts = [nameSize[nameCodes[d.id]][startSize + 1].Date, fullNames[d.id], size + " kWh", population + " mln"];
								
							for (var i = 0; i < popup_texts.length; i++){
								data_reference.append("text")
									.text(popup_texts[i])
									.attr("class", "text")
									.attr("x", 125 + 70)
									.attr("y", 45 + 23 * i)
									.attr("font-family", "Verdana")
									.attr("font-size", "10");
							} 
						})
						.attr("stroke", "black")
						.attr("fill", function(d,i) {
							if (nameSize[nameCodes[d.id]] != undefined){
								
								// TODO: better "growth" amounts
								var electricity = parseFloat(nameSize[nameCodes[d.id]][startSize]["Annual generated"]);
								
								
								var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population);
								if (population > 450){
									population = population / 1000;
								}						
								
								var electricityPerCapita = electricity / (population * 1000);
								
								if (electricityPerCapita < 1){
									return "#edf8fb"
								}
								if (electricityPerCapita < 5){
									return "#ccece6" 
								}
								if (electricityPerCapita < 10){
									return "#99d8c9"
								}
								if (electricityPerCapita < 50){
									return "#66c2a4"
								}
								if (electricityPerCapita < 100){
									return "#2ca25f"
								}
								if (electricityPerCapita < 500){
									return "#006d2c"
								}
							}
							return d3.interpolate("#edf8fb", "#006d2c")*0;
						});
						if (startSize != 0){
							startSize -= 1;
							clearTimeout();
							//setTimeout(recolor, 1000);
						}
					}
				}
				});
			});

			d3.select(self.frameElement).style("height", height + "px"); 
		};
		};
		function drawUScostsmap(){
			var svg = d3.selectAll("svg").remove()
			d3.selectAll("#third_dropdown").remove()
			d3.selectAll("#title").remove()
			d3.selectAll("#graph-title").append("hr")
					.attr("id", "title")
					.attr("class", "col-lg-10 text-center")
					.style("margin-left", "9%")
			d3.selectAll("#graph-title").append("h3")
					.attr("id", "title")
					.attr("class", "col-lg-12 text-center")
					.text("Visualization of costs of PV-panels per kW per state")
					
			var q = queue(1);
			for (var i = 0; i < state_ids.length; i++){
				q.defer(d3.csv, "\\Data\\PVdata\\normalized_costs_growth\\cost_per_size\\cost_per_size_" + state_ids[i] + ".csv");
				q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\population_size\\" + state_ids[i] + "_population.csv");
			}
			q.awaitAll(drawMap);
			
		function drawMap(errors,allData){	
		
			var width = 1160,
				height = 500;
				
			var projection = d3.geo.albersUsa()
				.scale(900)
				.translate([width / 2 + 50, (height - 80) / 2]);

			var path = d3.geo.path()
				.projection(projection);
				
			var x = d3.time.scale()
				.range([100,160])
				.domain(dates);
				
			var xAxis = d3.svg.axis()
				.scale(x)
				.tickValues(dates)
				.orient("bottom");

			var svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("class", "center-block");
			
			// Insert rectangle to show data in, add legend title, add buttons
			var data_reference = svg.insert("g");
				data_reference.append("rect")
					.attr("x", 120)
					.attr("y", 30)
					.attr("width", 150)
					.attr("height", 230)
					.attr("stroke", "black")
					.attr("fill", "transparent")
				data_reference.append("text")
					.text("Legend & data")
					.attr("x", 121)
					.attr("y", 22)
					.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
					.attr("font-size", "16");
				data_reference.append("svg:image")
					.attr("class", "pause-button")
					.attr("x", 230)
					.attr("y", 270)
					.attr("width", 30)
					.attr("height", 29)
					.attr("xlink:href", "images/pause.png");
				data_reference.append("svg:image")
					.attr("class", "reset-button")
					.attr("x", 130)
					.attr("y", 270)
					.attr("width", 30)
					.attr("height", 29)
					.attr("xlink:href", "images/previous.png");
				data_reference.append("svg:image")
					.attr("class", "play-button")
					.attr("x", 180)
					.attr("y", 270)
					.attr("width", 30)
					.attr("height", 29)
					.attr("xlink:href", "images/play.png");
					
				var texts = ["Year", "State: ", "Costs/kW: ", "Population: "];
						
				for (var j = 0; j < texts.length; j++){
					data_reference.append("text")
						.attr("class", "legend_text")
						.text(texts[j])
						.attr("x", 125)
						.attr("y", 45 + 23 * j)
						.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
						.attr("font-size", "10");
				}
				
				var colors = ["grey","#006d2c","#2ca25f","#66c2a4","#99d8c9","#ccece6"]
				var colors_legend = ["No data: ", "0 - 4999 $/kW:","5000 - 7499 $/kW:", "7500 - 9999 $/kW:", "10.000 - 12.499 $/kW:", "12.500+ $/kW:"]
				for (var i = 0; i < colors.length; i++){
					data_reference.append("text")
						.attr("class", "legend")
						.text(colors_legend[i])
						.attr("x", 125)
						.attr("y", 135 + 20 * i)
						.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
						.attr("font-size", "10");
					data_reference.append("rect")
						.attr("class", "legend")
						.attr("x", 240)
						.attr("y", 127 + 20 * i)
						.attr("width", 10)
						.attr("height", 10)
						.attr("stroke", "black")
						.attr("fill", colors[i]);
						
				}

			// Insert rectangle to point to current shown year	
			var current_date_rect = svg.insert("g");
				current_date_rect.append("rect")
					.attr("class", "date_rect")
					.attr("x", 95)
					.attr("y", 435)
					.attr("width", 10)
					.attr("height", 10)
					.attr("stroke", "black")
					.attr("fill", "green")	
			
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0,450)")
				.call(xAxis);
			

			d3.json("us.json", function(unitedState) {
				var data = topojson.feature(unitedState, unitedState.objects.states).features;
		
				// List of names connected to ids
				d3.csv("us-state-names.csv", function(csv){
					var nameCodes = {};
					var fullNames = {};
					var nameSize = {};
					var namePopulation = {};
					var x = 0;
					csv.forEach(function(d,i){
						fullNames[d.id] = d.name;
						nameCodes[d.id] = d.code;
						nameSize[d.code] = allData[x];
						namePopulation[d.code] = allData[x + 1];
						x += 2;
					});

				setTimeout(recolor, 100);
				
				var startSize = 15;
				var startDate = 21
				var startRect = 95;
				var stepRect = 60;
				d3.selectAll(".pause-button")
					.on("click", pause);
					
				d3.selectAll(".reset-button")
					.on("click", reset_recolor);
				
				d3.selectAll(".play-button")
					.on("click", play_recolor);
					
				var pause_clicked = 0;
				
				function pause(){
					pause_clicked += 1;
				}
				
				function play_recolor(){
					if (pause_clicked % 2 == 0){
						recolor();
						clearTimeout();
						setTimeout(play_recolor, 2500);
					}
					if (pause_clicked == 1){
						pause_clicked = 0;
					}
				}
				
				function reset_recolor(){
					startSize = 15;
					startDate = 21;
					recolor();			
				}
				
				
				function recolor(){
					
					if (startSize >= 0){
						
						d3.selectAll(".date_rect")
							.transition()
							.duration(500)
							.attr("x", startRect + (stepRect * (15 - startSize)));
					
						svg.append("g")
						.attr("class", "states-bundle")
						.selectAll("path")
						.data(data)
						.enter()
						.append("path")
						.attr("d", path)
						.on("mouseover", function(d) {
												
							d3.selectAll(".text").remove()
							
							var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population)
							if (population > 450){
								population = population / 1000;
							}
							population = String(population).substr(0,5);
							
							costs = parseFloat(nameSize[nameCodes[d.id]][startSize]["Cost/size"])
							
							var popup_texts = [nameSize[nameCodes[d.id]][startSize + 1].Date, fullNames[d.id], costs + " $/kW", population + " mln"];
								
							for (var i = 0; i < popup_texts.length; i++){
								data_reference.append("text")
									.text(popup_texts[i])
									.attr("class", "text")
									.attr("x", 125 + 70)
									.attr("y", 45 + 23 * i)
									.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
									.attr("font-size", "10");
							}	
						})
						.attr("stroke", "black")
						.attr("fill", function(d,i) {
							if (nameSize[nameCodes[d.id]] != undefined){
								
								
								
								// TODO: Decide on coloring! 
								
								var size = parseFloat(nameSize[nameCodes[d.id]][startSize]["Cost/size"]);
								
								if (size == 0){
									return "grey" 
								}
								if (size < 5000){
									return "#ccece6" 
								}
								if (size < 7500){
									return "#99d8c9"
								}
								if (size < 10000){
									return "#66c2a4"
								}
								if (size < 12500){
									return "#2ca25f"
								}
								else {
									return "#006d2c"
								}
							}
							return "#ccece6" ;
						});
						if (startSize != 0){
							startSize -= 1;
							clearTimeout();
						}
					}
				}
				});
			});

			d3.select(self.frameElement).style("height", height + "px"); 
		};
		};
		

