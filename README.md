# ProgProject
GitHub for Programming Project June 2015

## Problem definition ##
### Intro ###
Renewable energy resources, their usage, as well as national and international differences between usage, is a topic that has 
been visualized in many ways the last decades. Large organizations such governmental research institutes and consultancy firms have spent a lot of time in this field, in attempts to identify trends and growth of renewable energy. 

### Solution ###
Unfortunately, it seems that growth is mostly visualized in terms of total installed capacity, or amount of jobs in the renewable energy sector. I want to change this, and visualize the growth of renewable energy per US state based on a number of different parameters:

- State population (on 1-1-19XX or 1-1-20XX), total capacity divided by state population; 
- "Growth" in terms of normalized costs per kW (based on installed panels);
- Growth of generated electrity per state based on average solar radiation per state;

The visualization will consist of the following different views:
1) US map, with a dropdown menu to select on which parameter to color the states (one of the above mentioned parameters), and an automatically changing date, increasing the date by year each time and therefore making this map animated; 
2) Line graph, this graph can be triggered by clicking on a single state, showing the graph over time of the above mentioned parameters;

Altogether, this will mean that a lot of data must be found and bound to HTML elements using d3. Based on experience from the Data Processing course of the minor Programming at the UvA this visualization will be developed.

### Data ###
The National Renewable Energy Laboratory has been working on their database with data on solar panels in the US since the beginning of the 21st century, and currently have more than 420,000 entries of installed solar panels in the US. The database is called 'The Open PV Project' and, as the name suggests, is a publicly accessible database. 

Each solar panel that is entered into the database, has information on the State it is in, the Zipcode, the size (in kW), the cost of the total project, and the date it was installed. To have a go at looking through some of these entries, go to https://openpv.nrel.gov/search. 

## Sketch of visualization ##

the US map will look like this: 
![US map sketch](https://github.com/Thomasvdw/ProgProject/tree/master/Sketches/Map-view.png)

The linegraph will look like this: 
![Line graph sketch](https://github.com/Thomasvdw/ProgProject/tree/master/Sketches/graph-view.png)

## Planning ##

First week: US map drawing and coloring, data sets ready and checked of:
  - per state population per date;
  - per state normalized costs per date;
  - per state generated electricity based on avg. solar radiation per year;

Second week: Interaction to go from geo-view to graph-view, with ability to select or deselect certain states and to change showed data. 

Third week: If first and second week have succesfully been implemented, work on optional extra's. Else work on fixing problems that were encountered in the first or second week. 

Fourth week: Fine-tune, cleaning all code, cleaning up GitHub. Prepare final version. 

## Potential difficulties ##

1) I have not worked with multiple scripts on a single page, this may cause problems to implement;

2) I have not worked with dropdown menu's to select through JavaScript, this may cause problems to implement;

3) Some data sets are so large that they may cause the script to run rather slow, this may cause problems in loading the visualization.


## Optional extra's ##

1) More detailed generated electricity for per state generated electricty based on avg. solar radiation, by not using a state average but by using a county average;

2) Map view of all solar panels of XXXX kW size shown as dots on the map;

3) Zoom-in functionality of the visualization in 2).

## Review other visualizations

Other visualization also often use a map and color coding to visualize certain trends or growths, and linegraphs are also widespread. By making it possible to select and deselect certain states, and providing multiple 'types' of growth, the visualization will hopefully give new insights into the solar panels market in the US. 
