
var state_ids = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI'
						,'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN'
						,'MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH'
						,'OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA'
						,'WV','WI','WY']
		
		d3.select("#Line")
			.on("click", drawLine);
		
		var q = queue(1);
			for (var i = 0; i < state_ids.length; i++){
				q.defer(d3.csv, "\\Data\\PVdata\\population_energy_growth\\solar_size\\solar_size_" + state_ids[i] + ".csv");
				}
			q.awaitAll(saveData);
			
		var lineData;
		
		function saveData(errors, Data){
			lineData = Data;
			return lineData;
		}
						
		function drawLine(){
			var container = d3.selectAll(".container")
			var third_dropdown = container.append("div")
				.attr("class", "third_dropdown");
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
						drawSelectedState(this.id);})
					.attr("role", "menuitem")
					.attr("tabindex", "-1")
					.attr("href", "#" + state_ids[i])
					.text(state_ids[i]);
			}
			drawSelectedState("CA");
		}
		
		var drawn = 0;
		function drawSelectedState(state){
			
			var svg = d3.selectAll("svg").remove()
			
			var selectedState = state;
							
			var margin = {top: 20, right: 80, bottom: 30, left: 50},
				width = 1160 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;
					
			var parseDate = d3.time.format("%d-%m-%Y").parse;
				
			var x = d3.time.scale()
				.range([75, width]);
					
			var y = d3.scale.linear()
				.range([height, 0]);
					
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
				.y(function(d) { return y(d.Size); });
									
			var svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height + margin.bottom)
				.attr("class", "center-block");
			svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
			allSizes = {}
				
			lineData.forEach(function(d, i) {
				allSizes[state_ids[i]] = d
			});
				
			// allSizes contains following: allSizes[state code (2 letters)] = object of length 17 with for each the size and the date
				
			var getSizes = function(allSizes, state){
				return allSizes[state];
			}
				
			for (var i = 0; i < state_ids.length; i++){
				stateSizes = getSizes(allSizes, state_ids[i]);
				stateSizes.forEach(function(d) {
					if (drawn == 0){
						d.Date = d.Date.replace("1/1/", "01-01-");
						d.Date = parseDate(d.Date);
						d.Size = +d.Size;
					}
				})

				if (state_ids[i] == selectedState){
					x.domain(d3.extent(stateSizes, function(d) { return d.Date; }));
					y.domain(d3.extent(stateSizes, function(d) { return d.Size; }));
				}
				
				var path = svg.append("path")
					path.datum(stateSizes)
					path.attr("class", "line")
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
				.attr("transform", "translate(0," + height +")")
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
			    .text("Capacity (kW)");
		}
	