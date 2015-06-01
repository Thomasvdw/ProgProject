# ProgProject
GitHub for Programming Project June 2015

## Problem definition ##
### Intro ###
Renewable energy resources, their usage, as well as national and international differences between usage, is a topic that has 
been visualized in many ways the last decades. Large organizations such governmental research institutes and consultancy firms have spent a lot of time in this field, in attempts to identify trends and growth of renewable energy. 

### Solution ###
Unfortunately, it seems that growth is mostly visualized in terms of total installed capacity, or amount of jobs in the renewable energy sector. I want to change this, and visualize the growth of renewable energy per US state based on a number of different parameters:

- State population (on 1-1-19XX or 1-1-20XX);
- "Growth" in terms of normalized costs per kW (based on installed panels);
- Growth of generated electrity per state based on average solar radiation per state;

The visualization will consist of the following different views:
1) US map, with a dropdown menu to select on which parameter to color the states (one of the above mentioned parameters), and an automatically changing date, increasing the date by year eah time and therefore making this map animated; 
2) Line graph, this graph can be triggered by clicking on a single state, showing the graph over time of the above mentioned parameters;

Altogether, this will mean that a lot of data must be found and bound to HTML elements using d3. Based on experience from the Data Processing course of the minor Programming at the UvA this visualization will be developed.

### Data ###
The National Renewable Energy Laboratory has been working on their database with data on solar panels in the US since the beginning of the 21st century, and currently have more than 420,000 entries of installed solar panels in the US. The database is called 'The Open PV Project' and, as the name suggests, is a publicly accessible database. 

Each solar panel that is entered into the database, has information on the State it is in, the Zipcode, the size (in kW), the cost of the total project, and the date it was installed. To have a go at looking through some of these entries, go to https://openpv.nrel.gov/search. 

## Sketch of visualization ##

The US map will be based on this example: http://bl.ocks.org/NPashaP/raw/a74faf20b492ad377312/
The linegraph will look like this: http://projects.flowingdata.com/life-expectancy/

## Planning ##

## Potential difficulties ##

## Optional extra's ##

## Review other visualizations
