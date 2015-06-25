		function drawCostsLine(){

			drawn = 0;
			
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
					.text("Line graph of costs of PV-panels per kW per state")

			
			var container = d3.selectAll("#graph-title")
			var third_dropdown = container.append("div")
				.attr("id", "third_dropdown");
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
						drawSelectedState(this.id, CostsData, "costs");})
					.attr("role", "menuitem")
					.attr("tabindex", "-1")
					.attr("href", "#" + state_ids[i])
					.text(state_ids_to_names[state_ids[i]]);
			}
			
			$(".dropdown-menu li a").click(function(){
				$(this).parents("#third_dropdown").find('.btn').text($(this).text());
				$(this).parents("#third_dropdown").find('.btn').val($(this).text());
			});
			
			drawSelectedState("AL", CostsData, "costs")
		}