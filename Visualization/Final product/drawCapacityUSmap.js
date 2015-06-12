		d3.select("#USmap").on("click", drawUSmap);
		d3.select("#Capacity").on("click", drawUSmap);
		
		// Variables that are used in all d3 javascript files. 
		var parseDate = d3.time.format("%d-%m-%Y").parse;
		var dates = [parseDate("01-01-2000"), parseDate("01-01-2001"), parseDate("01-01-2002"),parseDate("01-01-2003"),
					parseDate("01-01-2004"), parseDate("01-01-2005"), parseDate("01-01-2006"), parseDate("01-01-2007"),
					parseDate("01-01-2008"), parseDate("01-01-2009"), parseDate("01-01-2010"), parseDate("01-01-2011"),
					parseDate("01-01-2012"), parseDate("01-01-2013"), parseDate("01-01-2014"), parseDate("01-01-2015")]

		// Draw map of capacity growth, after loading the capacity growth data. 
		function drawUSmap(){
			d3.selectAll(".third_dropdown").remove()
			d3.selectAll(".second_dropdown").remove()
			var svg = d3.selectAll("svg").remove()
	
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
				
			// insert Title
			/*
			svg.append("text")
				.attr("x", (width / 2))             
				.attr("y", 130)
				.attr("text-anchor", "middle")  
				.style("font-size", "16px") 
				.text("US states PV capacity growth");*/
			
			// Insert rectangle to show data in. 
			var data_reference = svg.insert("g");
				data_reference.append("rect")
					.attr("x", 120)
					.attr("y", 30)
					.attr("width", 150)
					.attr("height", 200)
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
					.attr("x", 235)
					.attr("y", 195)
					.attr("width", 30)
					.attr("height", 29)
					.attr("xlink:href", "images/next.png");
				data_reference.append("svg:image")
					.attr("class", "previous-button")
					.attr("x", 125)
					.attr("y", 195)
					.attr("width", 30)
					.attr("height", 29)
					.attr("xlink:href", "images/previous.png");
			
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
					
					max_sizes = []
					
					for (var x = 0; x < sizes.length; x++){
						var tmp = [];
						for (var y = 0; y < sizes[x].length; y++){
							tmp.push(parseFloat(sizes[x][y].Size));
						}
						max_sizes.push(Math.max.apply(Math, tmp));
					}
					var global_max = Math.max.apply(Math, max_sizes);
					
					svg.append("g")
					.attr("class", "states-bundle")
					.selectAll("path")
					.data(data)
					.enter()
					.append("path")
					.attr("d", path)
					.attr("stroke", "black")
					.on("mouseover", function(d) {
						var texts = ["Year: ", "State: ", "Growth: ", "Capacity: ", "Population: "];
						
						d3.selectAll(".text").remove()
						for (var j = 0; j < texts.length; j++){
							data_reference.append("text")
								.attr("class", "text")
								.text(texts[j])
								.attr("x", 125)
								.attr("y", 45 + 23 * j)
								.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
								.attr("font-size", "10");
						}
						
						

						var growth = parseFloat((parseFloat(parseFloat(nameSize[nameCodes[d.id]][15].Size) - parseFloat(nameSize[nameCodes[d.id]][16].Size))/parseFloat(nameSize[nameCodes[d.id]][16].Size)));
						var popup_texts = [nameSize[nameCodes[d.id]][15].Date, fullNames[d.id], String(growth * 100).substr(0,5) + " %", parseFloat(nameSize[nameCodes[d.id]][15].Size) + " MW", parseFloat(namePopulation[nameCodes[d.id]][19].Population) + " mln"];
							
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
					.attr("class", function(d,i) { 
						return nameCodes[d.id];
					})
					.attr("fill", "#f7fcfd");
				
				//setTimeout(recolor, 2500);
				
				var startSize = 14;
				var startDate = 20;
				var startRect = 95;
				var stepRect = 60;
				
				d3.selectAll(".next-button")
					.on("click", recolor);
				
				function recolor(){
					
					if (startSize >= 0){
						
						d3.selectAll(".date_rect")
							.transition()
							.attr("x", startRect + (stepRect * (15 - startSize)));
						
					
						svg.append("g")
						.attr("class", "states-bundle")
						.selectAll("path")
						.data(data)
						.enter()
						.append("path")
						.attr("d", path)
						.on("mouseover", function(d) {
													
							var texts = ["Year: ", "State: ", "Growth: ", "Capacity: ", "Population: "];
							d3.selectAll(".text").remove()
							for (var j = 0; j < texts.length; j++){
								data_reference.append("text")
									.attr("class", "text")						
									.text(texts[j])
									.attr("x", 125)
									.attr("y", 45 + 23 * j)
									.attr("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif;")
									.attr("font-size", "10");
							}
							
							var size = parseFloat(nameSize[nameCodes[d.id]][startSize].Size);
							var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population);
							var size_before = parseFloat(nameSize[nameCodes[d.id]][startSize + 1].Size);
							var size_difference = parseFloat(size - size_before);
							var growth = parseFloat(size_difference / size_before);
							
							var popup_texts = [nameSize[nameCodes[d.id]][startSize + 1].Date, fullNames[d.id], String(growth * 100).substr(0,5) + " %", parseFloat(nameSize[nameCodes[d.id]][startSize].Size) + " MW", parseFloat(namePopulation[nameCodes[d.id]][startDate].Population) + " mln"];
							
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
							if (nameSize[nameCodes[d.id]] != undefined){
								
								var normalSize = 14;
								var normal = parseFloat(nameSize[nameCodes[d.id]][normalSize].Size);
								
								while (normal == 0){
									normalSize -= 1;
									if (normalSize < 0){
										break;
									}
									normal = parseFloat(nameSize[nameCodes[d.id]][normalSize].Size);
								}
								
								// Divide current capacity by highest global capacity (of all states)
								var size = parseFloat(nameSize[nameCodes[d.id]][startSize].Size);
								var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population);
								
								var size_difference = parseFloat(size - normal);
								var growth = parseFloat(size_difference / normal);		
								
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
							startDate += 1;
							clearTimeout();
							//setTimeout(recolor, 2000);
						}
					}
				}
				});
			});

			d3.select(self.frameElement).style("height", height + "px"); 
		};
		};
		
