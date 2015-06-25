		function drawUScostsmap(){
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
					.attr("class", "next-button")
					.attr("x", 230)
					.attr("y", 270)
					.attr("width", 30)
					.attr("height", 29)
					.attr("xlink:href", "images/next.png");
				data_reference.append("svg:image")
					.attr("class", "previous-button")
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

				d3.selectAll(".next-button")
					.on("click", recolor);
					
				d3.selectAll(".previous-button")
					.on("click", previous_recolor);
					
				d3.selectAll(".play-button")
					.on("click", play_recolor);
				
				function play_recolor(){
					recolor();
					clearTimeout();
					setTimeout(play_recolor, 2500);
				}
				
				function previous_recolor(){
					startSize += 2;
					startDate -= 2;
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
		
