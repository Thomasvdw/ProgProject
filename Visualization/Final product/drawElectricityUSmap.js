		function drawUSelectricitymap(){
			d3.selectAll(".third_dropdown").remove()
			var svg = d3.selectAll("svg").remove()
	
			var q = queue(1);
			for (var i = 0; i < state_ids.length; i++){
				q.defer(d3.csv, "\\Data\\PVdata\\annual_generated_kwh_growth\\generated_" + state_ids[i] + ".csv");
			}
			q.awaitAll(drawMap);
			
		function drawMap(errors,allData){	
		
			var width = 1160,
				height = 500;
				
			var projection = d3.geo.albersUsa()
				.scale(1000)
				.translate([width / 2, (height + 150) / 2]);

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
				.attr("height", height + 150)
				.attr("class", "center-block");
				
			svg.append("text")
				.attr("x", (width / 2))             
				.attr("y", 130)
				.attr("text-anchor", "middle")  
				.style("font-size", "16px") 
				.text("US states PV generated electricity growth");
							
			var data_reference = svg.insert("g");
				data_reference.append("rect")
					.attr("x", (width / 2) - 75)
					.attr("y", 10)
					.attr("width", 150)
					.attr("height", 100)
					.attr("stroke", "black")
					.attr("fill", "transparent")
					
			var current_date_rect = svg.insert("g");
				current_date_rect.append("rect")
					.attr("class", "date_rect")
					.attr("x", 95)
					.attr("y", 580)
					.attr("width", 10)
					.attr("height", 10)
					.attr("stroke", "black")
					.attr("fill", "green")	
			
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0,600)")
				.call(xAxis);
			

			d3.json("us.json", function(unitedState) {
				var data = topojson.feature(unitedState, unitedState.objects.states).features;
		
				// List of names connected to ids
				d3.csv("us-state-names.csv", function(csv){
					var nameCodes = {};
					var fullNames = {};
					var nameSize = {};
					csv.forEach(function(d,i){
						fullNames[d.id] = d.name;
						nameCodes[d.id] = d.code;
						nameSize[d.code] = allData[i];
					});
					
					/* Get global maximum value in data
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
						var texts = ["State: ", "Growth: ", "Capacity: "];
						
						d3.selectAll(".text").remove()
						for (var j = 0; j < texts.length; j++){
							data_reference.append("text")
								.attr("class", "text")
								.text(texts[j])
								.attr("x", (width / 2) - 75)
								.attr("y", 22.5 + 23 * j)
								.attr("font-family", "Verdana")
								.attr("font-size", "12.5");
						}
						
						/* To add the data as text in box
						
						var growth = parseFloat((parseFloat(parseFloat(nameSize[nameCodes[d.id]][15].Size) - parseFloat(nameSize[nameCodes[d.id]][16].Size))/parseFloat(nameSize[nameCodes[d.id]][16].Size)));
						var popup_texts = [fullNames[d.id], String(growth * 100).substr(0,5) + " %", parseFloat(nameSize[nameCodes[d.id]][15].Size) + " MW", parseFloat(namePopulation[nameCodes[d.id]][19].Population) + " mln"];
							
						for (var i = 0; i < popup_texts.length; i++){
							data_reference.append("text")
								.text(popup_texts[i])
								.attr("x", (width / 2) - 75 + 70)
								.attr("y", 22.5 + 23 * i)
								.attr("font-family", "Verdana")
								.attr("font-size", "12.5");
						} */
					})
					.attr("class", function(d,i) { 
						return nameCodes[d.id];
					})
					.attr("fill", "#f7fcfd");
				
				setTimeout(recolor, 2500);
				
				var startSize = 14;
				var normal = startSize;
				var startRect = 95;
				var stepRect = 60;

				
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
													
							var texts = ["State: ", "Growth: ", "Capacity: "];
							d3.selectAll(".text").remove()
							for (var j = 0; j < texts.length; j++){
								var font_size = "12.5";
								if (i == 3){
									font_size = "11";
								}
								data_reference.append("text")
									.attr("class", "text")
									.text(texts[j])
									.attr("x", (width / 2) - 75)
									.attr("y", 22.5 + 23 * j)
									.attr("font-family", "Verdana")
									.attr("font-size", font_size);
							}
							
							/* To add data as text in box
							
							var size = parseFloat(nameSize[nameCodes[d.id]][startSize].Size);
							var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population);
							var size_before = parseFloat(nameSize[nameCodes[d.id]][startSize + 1].Size);
							var size_difference = parseFloat(size - size_before);
							var growth = parseFloat(size_difference / size_before);
							
							var popup_texts = [fullNames[d.id], String(growth * 100).substr(0,5) + " %", parseFloat(nameSize[nameCodes[d.id]][startSize].Size) + " MW", parseFloat(namePopulation[nameCodes[d.id]][startDate].Population) + " mln"];
							
							for (var i = 0; i < popup_texts.length; i++){
								var j = 0;
								var font_size = "12.5";
								if (i == 0){
									j -= 20
								}
								if (i == 3){
									j += 10;
									font_size = "11";
								}
								data_reference.append("text")
									.text(popup_texts[i])
									.attr("x", (width / 2) - 75 + 70 + j)
									.attr("y", 22.5 + 23 * i)
									.attr("font-family", "Verdana")
									.attr("font-size", font_size);
								j = 0;
							}
							*/
						})
						.attr("stroke", "black")
						.attr("fill", function(d,i) {
							if (nameSize[nameCodes[d.id]] != undefined){
								
								// Divide size is the total electricity generated in this year, size_normal is 
								// the electricity that was generated in year t = 0. 
								var size = parseFloat(nameSize[nameCodes[d.id]][startSize]["Annual generated"]);
								var size_normal = parseFloat(nameSize[nameCodes[d.id]][normal]["Annual generated"]);
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
							setTimeout(recolor, 1000);
						}
					}
				}
				});
			});

			d3.select(self.frameElement).style("height", height + "px"); 
		};
		};
		
