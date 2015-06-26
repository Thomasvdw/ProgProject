'use strict'
function drawUScapacitymap(){
	// Remove previous svg elements, add title for new graph. 
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

	// Load data through queue
	var q = queue(1);
	for (var i = 0; i < state_ids.length; i++){
		q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\solar_size\\solar_size_" + state_ids[i] + ".csv");
		q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\population_size\\" + state_ids[i] + "_population.csv");
	}
	q.awaitAll(drawMap);
			
	function drawMap(errors,allData){	
	// Draw albersUsa projection on svg. 
	var width = 1160,
		height = 500,
		widthAdjustment = 50, 
		heightAdjustment = 80;
				
	var projection = d3.geo.albersUsa()
		.scale(900)
		.translate([(width / 2) + widthAdjustment, (height - heightAdjustment) / 2]);

	var path = d3.geo.path()
		.projection(projection);
			
	var x = d3.time.scale()
		.range([100,160])
		.domain(dates);
	
	// Put x-axis below the projection to show which year the current data is from
	var xAxis = d3.svg.axis()
		.scale(x)
		.tickValues(dates)
		.orient("bottom");

	var svg = d3.select("#graph").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "center-block")
		.attr("id", "capacityMap");
		
	var dataReferenceX = 120,
		dataReferenceY = 30,
		dataReferenceWidth = 150,
		dataReferenceHeight = 230,
		dataReferenceTextX = 121,
		dataReferenceTextY = 22;
			
	// Insert rectangle to show data in. 
	var data_reference = svg.insert("g");
		data_reference.append("rect")
			.attr("x", dataReferenceX)
			.attr("y", dataReferenceY)
			.attr("width", dataReferenceWidth)
			.attr("height", dataReferenceHeight)
			.attr("stroke", "black")
			.attr("fill", "transparent")
		data_reference.append("text")
			.text("Legend & data")
			.attr("x", dataReferenceTextX)
			.attr("y", dataReferenceTextY)
			.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
			.attr("font-size", "16");
			
		var buttonY = 270, 
			buttonWidth = 30,
			buttonHeight = 29,
			pauseX = 230, 
			resetX = 130, 
			playX = 180;
		
		// Add buttons for pause, play, reset
		data_reference.append("svg:image")
			.attr("class", "pause-button")
			.attr("x", pauseX)
			.attr("y", buttonY)
			.attr("width", buttonWidth)
			.attr("height", buttonHeight)
			.attr("xlink:href", "images/pause.png");
		data_reference.append("svg:image")
			.attr("class", "reset-button")
			.attr("x", resetX)
			.attr("y", buttonY)
			.attr("width", buttonWidth)
			.attr("height", buttonHeight)
			.attr("xlink:href", "images/previous.png");
		data_reference.append("svg:image")
			.attr("class", "play-button")
			.attr("x", playX)
			.attr("y", buttonY)
			.attr("width", buttonWidth)
			.attr("height", buttonHeight)
			.attr("xlink:href", "images/play.png");
		
	// Add legend explanation
	var texts = ["Year: ", "State: ", "Capacity: ", "Population: "];		
	for (var j = 0; j < texts.length; j++){
		var legendTextsX = 125, 
			legendTextsY = 45,
			legendTextsdY = 23;
			
		data_reference.append("text")
			.attr("class", "legend_text")
			.text(texts[j])
			.attr("x", legendTextsX)
			.attr("y", legendTextsY + legendTextsdY * j)
			.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
			.attr("font-size", "10");
		}
		
	// Add color bins to legend
	var colors = ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"]
	var colors_legend = ["0 MW:","1 - 99 MW:", "100 - 999 MW:", "1000 - 9999 MW:", "10.000 - 99.999 MW:", "100.000+ MW:"]
	for (var i = 0; i < colors.length; i++){
		var legendTextsX = 125, 
			legendTextsY = 135,
			legendTextsdY = 20,
			legendRectX = 230,
			legendRectY = 127, 
			legendRectLength = 10;
		
		data_reference.append("text")
			.attr("class", "legend")
			.text(colors_legend[i])
			.attr("x", legendTextsX)
			.attr("y", legendTextsY + legendTextsdY * i)
			.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
			.attr("font-size", "10");
		data_reference.append("rect")
			.attr("class", "legend")
			.attr("x", legendRectX)
			.attr("y", legendRectY + legendTextsdY * i)
			.attr("width", legendRectLength)
			.attr("height", legendRectLength)
			.attr("stroke", "black")
			.attr("fill", colors[i]);		
	}
		
	var currentDateRectX = 95,
		currentDateRectY = 435, 
		currentDateRectLength = 10;
			
	// Insert rectangle to point to current shown year
	var current_date_rect = svg.insert("g");
		current_date_rect.append("rect")
			.attr("class", "date_rect")
			.attr("x", currentDateRectX)
			.attr("y", currentDateRectY)
			.attr("width", currentDateRectLength)
			.attr("height", currentDateRectLength)
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
		
		// Draw map according to data of first year. 
		var time_to_start = 100;
		var time_to_recolor = 2500;
		setTimeout(recolor, time_to_start);	
		
		// Initialize starting values, use to find right data points
		var startSize = 15;
		var startDate = 21;
		var startRect = 95;
		var stepRect = 60;
								
		var pause_clicked = 0;
		
		// Function for pause, reset, and play buttons
		function pause(){
			pause_clicked += 1;
		}
				
		function play_recolor(){
			if (pause_clicked % 2 == 0){
				recolor();
				clearTimeout();
				setTimeout(play_recolor, time_to_recolor);
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
		
		d3.selectAll(".pause-button")
			.on("click", pause);
					
		d3.selectAll(".reset-button")
			.on("click", reset_recolor);
				
		d3.selectAll(".play-button")
			.on("click", play_recolor);
		
		// Function to draw map and color according to value of startSize and startDate
		function recolor(){	
			if (startSize >= 0){
			
				var takenSteps = 15;
				// Adjust year-point rectangle
				d3.selectAll(".date_rect")
					.transition()
					.duration(500)
					.attr("x", startRect + (stepRect * (takenSteps - startSize)));
				
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
						
						var populationDelimiter = 450, 
							popupTextX = 195,
							popupTextY = 45, 
							popupTextdY = 23;
							
						var size = parseFloat(nameSize[nameCodes[d.id]][startSize + 1].Size);
						var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population);
						
						// Adjust for mismatching data
						if (population > populationDelimiter){
							population = population / 1000;
						}
						population = String(population).substr(0,5);
						
						// Write mouse-over state data in legend rectangle
						var popup_texts = [nameSize[nameCodes[d.id]][startSize + 1].Date, fullNames[d.id], size + " MW", population + " mln"];
						for (var i = 0; i < popup_texts.length; i++){
							data_reference.append("text")
								.attr("class", "text")
								.text(popup_texts[i])
								.attr("x", popupTextX)
								.attr("y", popupTextY + popupTextdY * i)
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
							var stateColors = ["#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"]
							var count = 0
							for (var i = 100; i < 10000000; i = i * 10){
								if (size < i){
									return stateColors[count]
								}
								count += 1;
							}
						}
						return d3.interpolate("#edf8fb", "#006d2c")*0;
					});
					// Change startSize and startDate to increase the year by 1
					if (startSize != 0){
						startSize -= 1;
						startDate += 1;
						clearTimeout();
					}
				}
			}
			});
		});
	};
	};
function drawUSelectricitymap(){
	// Remove previous graphs, add title
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

	// Load data in queue
	var q = queue(1);
	for (var i = 0; i < state_ids.length; i++){
		q.defer(d3.csv, "\\Data\\PVdata\\annual_generated_kwh_growth\\generated_" + state_ids[i] + ".csv");
		q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\population_size\\" + state_ids[i] + "_population.csv");
	}
	q.awaitAll(drawMap);
			
	function drawMap(errors,allData){	
// Draw albersUsa projection on svg. 
	var width = 1160,
		height = 500,
		widthAdjustment = 50, 
		heightAdjustment = 80;
				
	var projection = d3.geo.albersUsa()
		.scale(900)
		.translate([(width / 2) + widthAdjustment, (height - heightAdjustment) / 2]);

	var path = d3.geo.path()
		.projection(projection);
			
	var x = d3.time.scale()
		.range([100,160])
		.domain(dates);
	
	// Put x-axis below the projection to show which year the current data is from
	var xAxis = d3.svg.axis()
		.scale(x)
		.tickValues(dates)
		.orient("bottom");

	var svg = d3.select("#graph").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "center-block")
		.attr("id", "electricityMap");
			
	var dataReferenceX = 120,
		dataReferenceY = 30,
		dataReferenceWidth = 150,
		dataReferenceHeight = 230,
		dataReferenceTextX = 121,
		dataReferenceTextY = 22;
			
	// Insert rectangle to show data in. 
	var data_reference = svg.insert("g");
		data_reference.append("rect")
			.attr("x", dataReferenceX)
			.attr("y", dataReferenceY)
			.attr("width", dataReferenceWidth)
			.attr("height", dataReferenceHeight)
			.attr("stroke", "black")
			.attr("fill", "transparent")
		data_reference.append("text")
			.text("Legend & data")
			.attr("x", dataReferenceTextX)
			.attr("y", dataReferenceTextY)
			.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
			.attr("font-size", "16");
			
		var buttonY = 270, 
			buttonWidth = 30,
			buttonHeight = 29,
			pauseX = 230, 
			resetX = 130, 
			playX = 180;
		
		// Add buttons for pause, play, reset
		data_reference.append("svg:image")
			.attr("class", "pause-button")
			.attr("x", pauseX)
			.attr("y", buttonY)
			.attr("width", buttonWidth)
			.attr("height", buttonHeight)
			.attr("xlink:href", "images/pause.png");
		data_reference.append("svg:image")
			.attr("class", "reset-button")
			.attr("x", resetX)
			.attr("y", buttonY)
			.attr("width", buttonWidth)
			.attr("height", buttonHeight)
			.attr("xlink:href", "images/previous.png");
		data_reference.append("svg:image")
			.attr("class", "play-button")
			.attr("x", playX)
			.attr("y", buttonY)
			.attr("width", buttonWidth)
			.attr("height", buttonHeight)
			.attr("xlink:href", "images/play.png");
					
		var texts = ["Year: ", "State: ", "Electricity p.p.: ", "Population"];
		for (var j = 0; j < texts.length; j++){
			var legendTextsX = 125, 
				legendTextsY = 45,
				legendTextsdY = 23;
				
			data_reference.append("text")
				.attr("class", "legend_text")
				.text(texts[j])
				.attr("x", legendTextsX)
				.attr("y", legendTextsY + legendTextsdY * j)
				.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
				.attr("font-size", "10");
		}
		
		// Add color bins to legend
		var colors = ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"]
		var colors_legend = ["0 - 0.99 kWh:","1 - 4.99 kWh:", "5 - 9.99 kWh:", "10 - 49.99 kWh:", "50 - 99.99 kWh:", "100+ kWh:"]
		for (var i = 0; i < colors.length; i++){
			var legendTextsX = 125, 
				legendTextsY = 135,
				legendTextsdY = 20,
				legendRectX = 230,
				legendRectY = 127, 
				legendRectLength = 10;
			
			data_reference.append("text")
				.attr("class", "legend")
				.text(colors_legend[i])
				.attr("x", legendTextsX)
				.attr("y", legendTextsY + legendTextsdY * i)
				.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
				.attr("font-size", "10");
			data_reference.append("rect")
				.attr("class", "legend")
				.attr("x", legendRectX)
				.attr("y", legendRectY + legendTextsdY * i)
				.attr("width", legendRectLength)
				.attr("height", legendRectLength)
				.attr("stroke", "black")
				.attr("fill", colors[i]);		
		}
			
		var currentDateRectX = 95,
			currentDateRectY = 435, 
			currentDateRectLength = 10;
				
		// Insert rectangle to point to current shown year
		var current_date_rect = svg.insert("g");
			current_date_rect.append("rect")
				.attr("class", "date_rect")
				.attr("x", currentDateRectX)
				.attr("y", currentDateRectY)
				.attr("width", currentDateRectLength)
				.attr("height", currentDateRectLength)
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
			
			// Color first year situation according to values of startSize and startDate
			var start_time = 100,
				recolor_time = 2500;
			setTimeout(recolor, start_time);
				
			var startSize = 15;
			var startDate = 21;
			var startRect = 95;
			var stepRect = 60;

			// Add button functionality
			d3.selectAll(".pause-button")
				.on("click", pause);
					
			d3.selectAll(".reset-button")
				.on("click", reset_recolor);
				
			d3.selectAll(".play-button")
				.on("click", play_recolor);
					
			var pause_clicked = 0;
			
			// Button functions
			function pause(){
				pause_clicked += 1;
			}
				
			function play_recolor(){
				if (pause_clicked % 2 == 0){
					recolor();
					clearTimeout();
					setTimeout(play_recolor, recolor_time);
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
			
			// Function to draw states and fill according to data values
			function recolor(){
				if (startSize >= 0){
					
					var takenSteps = 15;
					// Move year-pointing rectangle one step
					d3.selectAll(".date_rect")
						.transition()
						.duration(500)
						.attr("x", startRect + (stepRect * (takenSteps - startSize)));
					
					// Draw US states path, and fill accordingly. 
					svg.append("g")
						.attr("class", "states-bundle")
						.selectAll("path")
						.data(data)
						.enter()
						.append("path")
						.attr("d", path)
						.on("mouseover", function(d) {
							d3.selectAll(".text").remove()
							var populationDelimiter = 450, 
								popupTextX = 195,
								popupTextY = 45, 
								popupTextdY = 23;
							
							// When user moves mouse over state, shows data in the rectangle with data. 
							var size = parseFloat(nameSize[nameCodes[d.id]][startSize + 1]["Annual generated"])
							var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population)
							if (population > populationDelimiter){
								population = population / 1000;
							}
							
							size = size / (population * 1000)
							
							size = String(size).substr(0,5);						
							population = String(population).substr(0,5);
							
							// Write data in rectangle
							var popup_texts = [nameSize[nameCodes[d.id]][startSize + 1].Date, fullNames[d.id], size + " kWh", population + " mln"];
							for (var i = 0; i < popup_texts.length; i++){
								data_reference.append("text")
									.text(popup_texts[i])
									.attr("class", "text")
									.attr("x", popupTextX)
									.attr("y", popupTextY + popupTextdY * i)
									.attr("font-family", "Verdana")
									.attr("font-size", "10");
							} 
						})
						.attr("stroke", "black")
						.attr("fill", function(d,i) {
							if (nameSize[nameCodes[d.id]] != undefined){
								var populationDelimiter = 450;
								
								// Fills according to value of each data
								var electricity = parseFloat(nameSize[nameCodes[d.id]][startSize]["Annual generated"]);
								var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population);
								if (population > populationDelimiter){
									population = population / 1000;
								}						
								var electricityPerCapita = electricity / (population * 1000);
								
								var bins = [1, 5, 10, 50, 100, 500]
								var binColors = ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#2ca25f", "#006d2c"]
								for (var i = 0; i < bins.length; i++){
									if (electricityPerCapita < bins[i]){
										return binColors[i];
									}
								}
							}
							return "#edf8fb"
						});
						if (startSize != 0){
							startSize -= 1;
							clearTimeout();
						}
					}
				}
				});
			});
		};
		};
function drawUScostsmap(){
	// Remove previous graphs and add title
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
	
	// Load data in queue
	var q = queue(1);
	for (var i = 0; i < state_ids.length; i++){
		q.defer(d3.csv, "\\Data\\PVdata\\normalized_costs_growth\\cost_per_size\\cost_per_size_" + state_ids[i] + ".csv");
		q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\population_size\\" + state_ids[i] + "_population.csv");
	}
	q.awaitAll(drawMap);
			
	function drawMap(errors,allData){	
		
		var width = 1160,
			height = 500,
			widthAdjustment = 50, 
			heightAdjustment = 80;
				
		var projection = d3.geo.albersUsa()
			.scale(900)
			.translate([(width / 2) + widthAdjustment, (height - heightAdjustment) / 2]);

		var path = d3.geo.path()
			.projection(projection);
				
		var x = d3.time.scale()
			.range([100,160])
			.domain(dates);
				
		var xAxis = d3.svg.axis()
			.scale(x)
			.tickValues(dates)
			.orient("bottom");

		var svg = d3.select("#graph").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "center-block")
			.attr("id", "costsMap");
			
		var dataReferenceX = 120,
			dataReferenceY = 30,
			dataReferenceWidth = 150,
			dataReferenceHeight = 230,
			dataReferenceTextX = 121,
			dataReferenceTextY = 22;
			
		// Insert rectangle to show data in. 
		var data_reference = svg.insert("g");
			data_reference.append("rect")
				.attr("x", dataReferenceX)
				.attr("y", dataReferenceY)
				.attr("width", dataReferenceWidth)
				.attr("height", dataReferenceHeight)
				.attr("stroke", "black")
				.attr("fill", "transparent")
			data_reference.append("text")
				.text("Legend & data")
				.attr("x", dataReferenceTextX)
				.attr("y", dataReferenceTextY)
				.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
				.attr("font-size", "16");
				
		var buttonY = 270, 
			buttonWidth = 30,
			buttonHeight = 29,
			pauseX = 230, 
			resetX = 130, 
			playX = 180;
		
		// Add buttons for pause, play, reset
		data_reference.append("svg:image")
			.attr("class", "pause-button")
			.attr("x", pauseX)
			.attr("y", buttonY)
			.attr("width", buttonWidth)
			.attr("height", buttonHeight)
			.attr("xlink:href", "images/pause.png");
		data_reference.append("svg:image")
			.attr("class", "reset-button")
			.attr("x", resetX)
			.attr("y", buttonY)
			.attr("width", buttonWidth)
			.attr("height", buttonHeight)
			.attr("xlink:href", "images/previous.png");
		data_reference.append("svg:image")
			.attr("class", "play-button")
			.attr("x", playX)
			.attr("y", buttonY)
			.attr("width", buttonWidth)
			.attr("height", buttonHeight)
			.attr("xlink:href", "images/play.png");
			
		// Add legend texts
		var texts = ["Year", "State: ", "Costs/kW: ", "Population: "];		
		for (var j = 0; j < texts.length; j++){
			var legendTextsX = 125, 
				legendTextsY = 45,
				legendTextsdY = 23;
				
			data_reference.append("text")
				.attr("class", "legend_text")
				.text(texts[j])
				.attr("x", legendTextsX)
				.attr("y", legendTextsY + legendTextsdY * j)
				.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
				.attr("font-size", "10");
		}
			
		// Add legend color bins
		var colors = ["grey","#006d2c","#2ca25f","#66c2a4","#99d8c9","#ccece6"]
		var colors_legend = ["No data: ", "0 - 4999 $/kW:","5000 - 7499 $/kW:", "7500 - 9999 $/kW:", "10.000 - 12.499 $/kW:", "12.500+ $/kW:"]
		for (var i = 0; i < colors.length; i++){
			var legendTextsX = 125, 
				legendTextsY = 135,
				legendTextsdY = 20,
				legendRectX = 230,
				legendRectY = 127, 
				legendRectLength = 10;
			
			data_reference.append("text")
				.attr("class", "legend")
				.text(colors_legend[i])
				.attr("x", legendTextsX)
				.attr("y", legendTextsY + legendTextsdY * i)
				.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
				.attr("font-size", "10");
			data_reference.append("rect")
				.attr("class", "legend")
				.attr("x", legendRectX)
				.attr("y", legendRectY + legendTextsdY * i)
				.attr("width", legendRectLength)
				.attr("height", legendRectLength)
				.attr("stroke", "black")
				.attr("fill", colors[i]);	
		}

		var currentDateRectX = 95,
			currentDateRectY = 435, 
			currentDateRectLength = 10;
				
		// Insert rectangle to point to current shown year
		var current_date_rect = svg.insert("g");
			current_date_rect.append("rect")
				.attr("class", "date_rect")
				.attr("x", currentDateRectX)
				.attr("y", currentDateRectY)
				.attr("width", currentDateRectLength)
				.attr("height", currentDateRectLength)
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

			// Color first year situation according to values of startSize and startDate
			var start_time = 100,
				recolor_time = 2500;
			setTimeout(recolor, start_time);
				
			var startSize = 15;
			var startDate = 21;
			var startRect = 95;
			var stepRect = 60;
		
			// Add button functionality
			d3.selectAll(".pause-button")
				.on("click", pause);
					
			d3.selectAll(".reset-button")
				.on("click", reset_recolor);
			
			d3.selectAll(".play-button")
				.on("click", play_recolor);
				
			var pause_clicked = 0;
			// Add button functions to add functionality
			function pause(){
				pause_clicked += 1;
			}
				
			function play_recolor(){
				if (pause_clicked % 2 == 0){
					recolor();
					clearTimeout();
					setTimeout(play_recolor, recolor_time);
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
			
			// Function to draw US states and fill according to data values
			function recolor(){
				if (startSize >= 0){
						
					var takenSteps = 15;
					// Move year-pointing rectangle one step
					d3.selectAll(".date_rect")
						.transition()
						.duration(500)
						.attr("x", startRect + (stepRect * (takenSteps - startSize)));
					
					svg.append("g")
						.attr("class", "states-bundle")
						.selectAll("path")
						.data(data)
						.enter()
						.append("path")
						.attr("d", path)
						.on("mouseover", function(d) {
							// Function to write data as mouse moves over a state. 
							d3.selectAll(".text").remove()
							
							var populationDelimiter = 450, 
								popupTextX = 195,
								popupTextY = 45, 
								popupTextdY = 23;									
							var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population)
							if (population > populationDelimiter){
								population = population / 1000;
							}
							var population = String(population).substr(0,5);	
							var costs = parseFloat(nameSize[nameCodes[d.id]][startSize + 1]["Cost/size"])
							
							var popup_texts = [nameSize[nameCodes[d.id]][startSize + 1].Date, fullNames[d.id], costs + " $/kW", population + " mln"];
							for (var i = 0; i < popup_texts.length; i++){
								data_reference.append("text")
									.text(popup_texts[i])
									.attr("class", "text")
									.attr("x", popupTextX)
									.attr("y", popupTextY + popupTextdY * i)
									.attr("font-family", "Verdana")
									.attr("font-size", "10");
							}	
						})
						.attr("stroke", "black")
						.attr("fill", function(d,i) {
							if (nameSize[nameCodes[d.id]] != undefined){
								// Function to fill state according to data value specific through color bins. 
								var size = parseFloat(nameSize[nameCodes[d.id]][startSize]["Cost/size"]);
								if (size == 0){
									return "grey" 
								}
								var bins = [5000, 7500, 10000, 12500]
								var binColors = ["#006d2c", "#2ca25f","#66c2a4" , "#99d8c9"]
								for (var i = 0; i < bins.length; i++){
									if (size < bins[i]){
										return binColors[i];
									}
								}
								return "#ccece6"				
							}
							return "grey";
						});
						if (startSize != 0){
							startSize -= 1;
							clearTimeout();
						}
					}
				}
				});
			});
		};
		};