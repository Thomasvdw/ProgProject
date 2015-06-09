# ProgProject

Thomas van der Wardt
June 2015

## Minimum viable product

- Interactive map of the US: each state colored based on the growth, transition each 2 seconds to next year, printing the current showed year on the page. 

- Select other visualization: select in dropdown menu to go to line graph-view of the shown data, transitioning from the map-view to a line graph-view of the growth.  

- Possibility to select which parameter to show: dropdown menu that lets user decide which of the three types of growth to show in the map-view or in the line graph. 

## List of JavaScript implementations required:

- Using us.json to draw each of the states on a map;
- Loading all the required data at once, eliminating the need to bother the user to wait for data-loading in a later stage; 
- 3 scripts to color-fill each state: 
	1) Growth in terms of capacity; 
	2) Growth in terms of costs per kW; 
	3) Growth in terms of total generated electricity per state; 
- 3 scripts to draw line graph: 
	1) Growth in terms of capacity; 
	2) Growth in terms of costs per kW; 
	3) Growth in terms of total generated electricity per state;

## Data sources: 

- All data that is described by either color-coding or by the line graph, comes from https://openpv.nrel.gov/index. 
	- data reformatting: 
		- Use of python to calculate averages and totals per date;
		- Use of population data from Census.gov for population per state data;
		- Use of solar radiation data from http://solargis.info/ to calculate the generated electricity per location. 
- Drawing the states of the US is from the us.json file.

## Sketch of final product:

See sketches map for both the map-view and the line graph-view. 



