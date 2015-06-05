
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
				.translate([(width - 100) / 2, height / 2]);

			var path = d3.geo.path()
				.projection(projection);

			var svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("class", "visualization");
			
			svg.append("rect")
				.attr("x", 0)
				.attr("y", 50)
				.attr("width", 150)
				.attr("height", 200)
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
					var x = 0;
					csv.forEach(function(d,i){
						fullNames[d.id] = d.name;
						nameCodes[d.id] = d.code;
						nameSize[d.code] = allData[x];
						namePopulation[d.code] = allData[x + 1];
						x += 2;
					});
					
					svg.append("g")
					.attr("class", "states-bundle")
					.selectAll("path")
					.data(data)
					.enter()
					.append("path")
					.attr("d", path)
					.attr("stroke", "black")
					.on("mouseover", function(d) {
						//console.log(fullNames[d.id]);
					})
					.attr("class", function(d,i) { 
						return nameCodes[d.id];
					})
					.attr("fill", function(d,i) {
						if (nameSize[nameCodes[d.id]] != undefined){
							var size = parseFloat(nameSize[nameCodes[d.id]][15].Size);
							var population = parseFloat(namePopulation[nameCodes[d.id]][19].Population);
								
								
							// Find reference values: method #1 (% of max_size)
							/*
							var size_array = [];
							for (var i = 0; i < nameSize[nameCodes[d.id]].length; i++){
								size_array.push(parseInt(nameSize[nameCodes[d.id]][i].Size));
							}
							var max_size = Math.max.apply(null, size_array);
							var referencepopulation = parseFloat(namePopulation[nameCodes[d.id]][19].Population);
							var referenceSizePerCapita = parseFloat(max_size / referencepopulation);
							var sizePerCapita = parseFloat(size / population);
							var relativeAmount = parseFloat(sizePerCapita / referenceSizePerCapita);
							relativeAmount = parseFloat(size / max_size);
							
							
							if (isNaN(relativeAmount)){
								return "grey";
							} 
							*/
							// Reference values: method #2 (year growth)					
							var size_before = parseFloat(nameSize[nameCodes[d.id]][16].Size);
							var size_difference = parseFloat(size - size_before);
							var growth = parseFloat(size_difference / size_before);
									
							if (growth > 1){
								growth = 1;
							}	
							return d3.interpolate("#f7fcfd", "#00441b")(growth);	
						};
						return "#f7fcfd"
					});	
				
				setTimeout(recolor, 1000);
				
				var startSize = 14
				var startDate = 20
				
				function recolor(){
					
					if (startSize > 0){
					
						svg.append("g")
						.attr("class", "states-bundle")
						.selectAll("path")
						.data(data)
						.enter()
						.append("path")
						.attr("d", path)
						.on("mouseover", function(d) {
							console.log(fullNames[d.id]);
							console.log(nameSize[nameCodes[d.id]][startSize + 1].Size);
						})
						.attr("stroke", "black")
						.attr("fill", function(d,i) {
							if (nameSize[nameCodes[d.id]] != undefined){
								var size = parseFloat(nameSize[nameCodes[d.id]][startSize].Size);
								var population = parseFloat(namePopulation[nameCodes[d.id]][startDate].Population);
								var size_before = parseFloat(nameSize[nameCodes[d.id]][startSize + 1].Size);
								var size_difference = parseFloat(size - size_before);
								var growth = parseFloat(size_difference / size_before);						
								
								if (growth > 1){
									growth = 1;
								}
								return d3.interpolate("#f7fcfd", "#00441b")(growth);
							}
							
							var growth = 0;
							
							return d3.interpolate("#f7fcfd", "#00441b")(growth);
						});
					}
					startSize -= 1;
					startDate += 1;
					clearTimeout();
					setTimeout(recolor, 300);
				}
				});
			});

			d3.select(self.frameElement).style("height", height + "px"); 
		};
		};
		
