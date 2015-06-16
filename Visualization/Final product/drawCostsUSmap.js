		function drawUScostsmap(){
			d3.selectAll("#third_dropdown").remove()
			var svg = d3.selectAll("svg").remove()
	
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
			
			// insert Title
			svg.append("text")
				.attr("x", (width / 2))             
				.attr("y", 20)
				.attr("text-anchor", "middle")  
				.style("font-size", "16px") 
				.text("US states PV costs per kW");
			
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
					
					/* Get max of costs
					
					max_sizes = []
					
					for (var x = 0; x < sizes.length; x++){
						var tmp = [];
						for (var y = 0; y < sizes[x].length; y++){
							tmp.push(parseFloat(sizes[x][y].Size));
						}
						max_sizes.push(Math.max.apply(Math, tmp));
					}
					var global_max = Math.max.apply(Math, max_sizes);
					*/
					
					svg.append("g")
					.attr("class", "states-bundle")
					.selectAll("path")
					.data(data)
					.enter()
					.append("path")
					.attr("d", path)
					.attr("stroke", "black")
					.on("mouseover", function(d) {

						d3.selectAll(".text").remove()
						
						var population = parseFloat(namePopulation[nameCodes[d.id]][19].Population)
						if (population > 450){
							population = population / 1000;
						}
						population = String(population).substr(0,5);
						
						costs = parseFloat(nameSize[nameCodes[d.id]][15]["Cost/size"])
						
						var popup_texts = [nameSize[nameCodes[d.id]][15].Date, fullNames[d.id], costs + " $/kW", population + " mln"];
							
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
					.attr("class", function(d,i) { 
						return nameCodes[d.id];
					})
					.attr("fill", "#f7fcfd"); // TODO: starting coloring
				
				//setTimeout(recolor, 2500);
				
				var startSize = 14;
				var startDate = 20;
				var startRect = 95;
				var stepRect = 60;

				d3.selectAll(".next-button")
					.on("click", recolor);
					
				d3.selectAll(".previous-button")
					.on("click", previous_recolor);
				
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
								var size_normal = parseFloat(nameSize[nameCodes[d.id]][15]["Cost/size"]);
								var size_difference = parseFloat(size - size_normal);
								var growth = parseFloat(size_difference / size_normal);		
								
								if (isNaN(growth)){
									growth = 0;
								}
								
								if (growth > 1){
									growth = 1;
								}

								return d3.interpolate("#f7fcfd", "#00441b")(growth);
							}
							var growth = 0;
							return d3.interpolate("#f7fcfd", "#00441b")(growth);
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
		
