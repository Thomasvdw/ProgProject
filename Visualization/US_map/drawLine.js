
var state_ids = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI'
						,'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN'
						,'MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH'
						,'OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA'
						,'WV','WI','WY']
		
		d3.select("#Line").on("click", drawLine);
						
		function drawLine(){
			
			var svg = d3.selectAll("svg").remove()
		
			var q = queue(1);
				for (var i = 0; i < state_ids.length; i++){
					q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\solar_size\\solar_size_" + state_ids[i] + ".csv");
					q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\population_size\\" + state_ids[i] + "_population.csv");
				}
				q.awaitAll(drawMap);
			
			function drawMap(errors,allData){	
		
				var margin = {top: 20, right: 80, bottom: 30, left: 50},
					width = 1160 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;
					
				var parseDate = d3.time.format("%d%m%Y").parse;
				
				var x = d3.time.scale()
					.range([0, width]);
					
				var y = d3.scale.linear()
					.range([height, 0]);
					
				// Is this needed?
				var color = d3.scale.category10();
					
				var xAxis = d3.svg.axis()
					.scale(y)
					.orient("bottom");
				
				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");
				
				var line = d3.svg.line()
					.interpolate("basis")
					.x(function(d) { return x(d.date); })
					.y(function(d) { return y(d.size); });
									
				var svg = d3.select("body").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.attr("class", "visualization");
				
				svg.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				allSizes = {}
				
				var x = 1;
				allData.forEach(function(d, i) {
					console.log(d[x].Date)
					if (i % 2 == 0){
						allSizes[d[i].Date] = d[i].Size;
					}
				});
				console.log(allSizes);
			}
		}