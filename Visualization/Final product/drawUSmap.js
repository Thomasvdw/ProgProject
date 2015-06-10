
var state_ids = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI'
						,'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN'
						,'MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH'
						,'OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA'
						,'WV','WI','WY']

		d3.select("#USmap").on("click", drawUSmap);
		
		function drawUSmap(){
			var svg = d3.selectAll("svg").remove()
	
			var q = queue(1);
			for (var i = 0; i < state_ids.length; i++){
				q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\solar_size\\solar_size_" + state_ids[i] + ".csv");
				q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\population_size\\" + state_ids[i] + "_population.csv");
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

			var svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height + 150)
				.attr("class", "center-block");
							
			var data_reference = svg.insert("g");
				data_reference.append("rect")
					.attr("x", (width / 2) - 75)
					.attr("y", 10)
					.attr("width", 150)
					.attr("height", 100)
					.attr("stroke", "black")
					.attr("fill", "transparent")
			

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
						var texts = ["State: ", "Growth: ", "Capacity: ", "Population: "];
						
						d3.selectAll("text").remove()
						for (var j = 0; j < texts.length; j++){
							data_reference.append("text")
								.text(texts[j])
								.attr("x", (width / 2) - 75)
								.attr("y", 22.5 + 23 * j)
								.attr("font-family", "Verdana")
								.attr("font-size", "12.5");
						}

						var growth = parseFloat((parseFloat(parseFloat(nameSize[nameCodes[d.id]][15].Size) - parseFloat(nameSize[nameCodes[d.id]][16].Size))/parseFloat(nameSize[nameCodes[d.id]][16].Size)));
						var popup_texts = [fullNames[d.id], String(growth * 100).substr(0,5) + " %", parseFloat(nameSize[nameCodes[d.id]][15].Size) + " MW", parseFloat(namePopulation[nameCodes[d.id]][19].Population) + " mln"];
							
						for (var i = 0; i < popup_texts.length; i++){
							data_reference.append("text")
								.text(popup_texts[i])
								.attr("x", (width / 2) - 75 + 70)
								.attr("y", 22.5 + 23 * i)
								.attr("font-family", "Verdana")
								.attr("font-size", "12.5");
						}
					})
					.attr("class", function(d,i) { 
						return nameCodes[d.id];
					})
					.attr("fill", "#f7fcfd");
				
				setTimeout(recolor, 2500);
				
				var startSize = 14;
				var startDate = 20;
				
				function recolor(){
					
					if (startSize >= 0){
					
						svg.append("g")
						.attr("class", "states-bundle")
						.selectAll("path")
						.data(data)
						.enter()
						.append("path")
						.attr("d", path)
						.on("mouseover", function(d) {
													
							var texts = ["State: ", "Growth: ", "Capacity: ", "Population: "];
							d3.selectAll("text").remove()
							for (var j = 0; j < texts.length; j++){
								var font_size = "12.5";
								if (i == 3){
									font_size = "11";
								}
								data_reference.append("text")
									.text(texts[j])
									.attr("x", (width / 2) - 75)
									.attr("y", 22.5 + 23 * j)
									.attr("font-family", "Verdana")
									.attr("font-size", font_size);
							}
							
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
						})
						.attr("stroke", "black")
						.attr("fill", function(d,i) {
							if (nameSize[nameCodes[d.id]] != undefined){
								
								// Divide current capacity by highest global capacity (of all states)
								var size = parseFloat(nameSize[nameCodes[d.id]][startSize].Size);
								var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population);
								var size_before = parseFloat(nameSize[nameCodes[d.id]][startSize + 1].Size);
								var size_difference = parseFloat(size - size_before);
								var growth = parseFloat(size_difference / size_before);		

								growth = size / global_max;
								
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
							setTimeout(recolor, 1000);
						}
						/*
						else {
							// Restart?
							alert("Restart?");
							startSize = 15;
							startDate = 19;
							clearTimeout();
							setTimeout(recolor, 200);
						}
						*/
					}
				}
				});
			});

			d3.select(self.frameElement).style("height", height + "px"); 
		};
		};
		
