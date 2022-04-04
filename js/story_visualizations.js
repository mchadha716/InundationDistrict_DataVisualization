// created some global variables in this file to eliminate code repetition across functions
// we have multiple functions because of the story-telling aspects of our site, which is 
// replacing certain elements of interactivity (aproved by Cody)

let precipitation = true;

const setPrecipitation = val => {
  precipitation = val;
}

// variable to hold number of clicks on Next button
let clicks = 0;

const setClicks = count => {
  clicks = count;
}

const showPrecipitation = () => {
  document.getElementById('prec-text').className = 'small-text-section';
  document.getElementById('prec-content').className = 'storyboard-section';
  document.getElementById('flooding-text').className = 'hidden';
  document.getElementById('flooding-content').className = 'hidden';
  document.getElementById('prec-text').scrollIntoView();
  drawPrecipitationChart();
  setPrecipitation(true);
  setClicks(0);
}

const showFlooding = () => {
  document.getElementById('prec-text').className = 'hidden';
  document.getElementById('prec-content').className = 'hidden';
  document.getElementById('flooding-text').className = 'small-text-section';
  document.getElementById('flooding-content').className = 'storyboard-section';
  document.getElementById('flooding-text').scrollIntoView();
  drawChart();
  setPrecipitation(false);
  setClicks(0);
}

// dimensions for SVG canvas
let margin = {
  top: 60,
  left: 100,
  right: 200,
  bottom: 35
},
width = 1000 - margin.left - margin.right;
height = 1000 - margin.top - margin.bottom;

// svg canvas for all visualizations appearing in this portion of the site
const svg = d3.select("#vis-svg-3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);


const svg2 = d3.select('#vis-svg-4')
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// x-axis for the first visualizations/ first two slides of this portion of the story
// domain/range so that data can appear in chunks
// x-scale based on decade data
const x = d3.scaleTime()
  .domain([d3.timeParse("%Y")(1920), d3.timeParse("%Y")(2010)])
  .range([ 0, width ]);

// line/ticks for x-axis
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .attr('id', 'xaxis');

// label for x-axis
svg.append("text")
  .attr("class", "xlabel")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height - 6)
  .text("Decade")
  .style("font-size",22)
  .attr('id', 'xlabel');

// y-axis for first visualization
// domain/range so that data can appear in chunks
// y-scale based on number of flood days
const y = d3.scaleLinear()
  .domain([0, 160])
  .range([ height, 0 ]);

// line/ticks for y-axis
svg.append("g")
  .call(d3.axisLeft(y))
  .attr('id', 'yaxis');

const x2 = d3.scaleBand()
  .range([ 0, width ])
  .domain(['1966-1975', '1977-1986', '1987-1996', '1997-2006', '2007-2016'])
  .padding(0.2);

svg2.append("text")
  .attr("class", "xlabel-2")
  .attr("text-anchor", "middle")
  .attr("x", width/2)
  .attr("y", height + 42)
  .text("Decade")
  .style("font-size",22)
  .attr('id', 'xlabel2');

svg2.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x2));

// Add Y axis
const y2 = d3.scaleLinear()
  .domain([25, 45])
  .range([ height, 0]);
svg2.append("g")
  .call(d3.axisLeft(y2));

svg2.append("text")
  .attr("class", "ylabel-2")
  .attr("text-anchor", "end")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Average Inches of Precipitation Per Year")
  .style("font-size",22)
  .attr('id', 'ylabel2');

svg2.append("text")
  .attr("x", width / 2 )
  .attr("y", -16)
  .text("Precipitation In The Northeast")
  .style("font-size",30)
  .style("text-anchor", "middle")
  .attr('id', 'title3');

// label for y-axis
svg.append("text")
  .attr("class", "ylabel")
  .attr("text-anchor", "end")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Number of High-Tide Flood Days")
  .style("font-size",22)
  .attr('id', 'ylabel');

// title for first visualization
svg.append("text")
  .attr("x", width / 2 )
  .attr("y", -16)
  .text("Past High-Tide Flooding")
  .style("font-size",30)
  .style("text-anchor", "middle")
  .attr('id', 'title1');

// legend for first visualization
svg.append("circle")
  .attr("cx",745)
  .attr("cy",30)
  .attr("r", 6)
  .style("fill", "#ff6961")
  .attr('id', 'bostonCirc');
svg.append("circle")
  .attr("cx",745)
  .attr("cy",55)
  .attr("r", 6)
  .style("fill", "#17BEBB")
  .attr('id', 'natCirc');
svg.append("text")
  .attr("x", 755)
  .attr("y", 30)
  .text("Boston")
  .style("font-size", 20)
  .attr("alignment-baseline","middle")
  .attr('id', 'bostonLabel');
svg.append("text")
  .attr("x", 755)
  .attr("y", 55)
  .text("National Avg.")
  .style("font-size", 20)
  .attr("alignment-baseline","middle")
  .attr('id', 'natLabel');

// makes paths look like they're drawn on the page
const pathTransition = (pathId, transition, remove) => {
  // select path by id
  const path = d3.select(pathId);

  // determine length of path
  const pathLength = path.node().getTotalLength();

  // use default or given transition
  const transitionPath = transition || 
    d3.transition()
      .delay(200)
      .ease(d3.easeSin)
      .duration(2500);

  // use transition, path length and stroke-dash attributes to
  // make path appear as though it is being drawn
  if(remove) {
    path
    .transition(transitionPath)
    .attr("stroke-dasharray", pathLength)
    .attr("stroke-dashoffset", pathLength);
  }
  else {
    path
    .attr("stroke-dasharray", pathLength)
    .attr("stroke-dashoffset", pathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0);
  }
}

// function to draw the first stage of the first visualization
const drawChart = () => {

  // read in initial data
  d3.csv("data/high_tide_flooding_1.csv",
  function(d){
    return { 
      decade : d3.timeParse("%Y")(d.decade), 
      boston : d.boston, 
      national : d.national, 
    }
  }).then(
    function(data) {

      // red path for Boston data
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ff6961")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d.decade) })
          .y(function(d) { return y(d.boston) })
        )
        .attr('id', 'boston');

      // blue path for National data
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", '#17BEBB')
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
        .x(function(d) {return x(d.decade)})
        .y(function(d) {return y(d.national)})
        )
        .attr('id', 'national');

      // draw paths on screen
      pathTransition('#boston', null, false);
      pathTransition('#national', null, false);

    }
  )
};

// function to draw paths for the rest of the data for the first visualization
const chartExtension = () => {
  // read in the rest of the data
  d3.csv("data/high_tide_flooding_2.csv",
  function(d){
    return { 
      decade : d3.timeParse("%Y")(d.decade), 
      boston : d.boston, 
      national : d.national
    }
  }).then(
    function(data) {
      // rest of the Boston path
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ff6961")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d.decade) })
        .y(function(d) { return y(d.boston) })
        )
        .attr('id', 'boston2');

      // rest of the national path
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", '#17BEBB')
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
        .x(function(d) {return x(d.decade)})
        .y(function(d) {return y(d.national)})
        )
        .attr('id', 'national2');

      // delayed transition
      const delayedTransition = d3.transition()
        .delay(800)
        .ease(d3.easeSin)
        .duration(2500);

      // draw paths on screen
      pathTransition('#boston2', delayedTransition, false);
      pathTransition('#national2', delayedTransition, false);
    }
  )
}

// function to remove first visualization before showing next one
const removeLineChart = () => {
  // transition for removing second set of paths
  const transition1 = d3
    .transition()
    .delay(200)
    .ease(d3.easeSin)
    .duration(800);

  // transition for removing first set of paths
  const transition2 = d3
    .transition()
    .delay(900)
    .ease(d3.easeSin)
    .duration(800);

  // remove each path
  pathTransition('#boston2', transition1, true);
  pathTransition('#national2', transition1, true);
  pathTransition('#boston', transition2, true);
  pathTransition('#national', transition2, true);

  // remove axes, labels, titles and national part of legend
  d3.select('#xlabel').remove();
  d3.select('#xaxis').remove();
  d3.select('#ylabel').remove();
  d3.select('#yaxis').remove();
  d3.select('#natCirc').remove();
  d3.select('#natLabel').remove();
  d3.select('#title1').remove();
}

// function to draw second visualization on same svg canvas
const drawNewChart = () => {
  // read new data
  d3.csv("data/projected_flooding.csv",
  function(d){
    return { 
      year : d3.timeParse("%Y")(d.year), 
      days : d.days
    }
  }).then( 
    function(data) {
      // tick values for x-axis
      // (not evenly distributed but requested by partner)
      const tickValues = [
        d3.timeParse("%Y")(2000), 
        d3.timeParse("%Y")(2020), 
        d3.timeParse("%Y")(2030), 
        d3.timeParse("%Y")(2050)
      ]

      // new x-scale based on new year data
      const x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);

      // new x-axis based on new data
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickValues(tickValues));
      
      // new x-label for new data
      svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Year")
        .style("font-size",22);

      // new y-scale for new data
      const y = d3.scaleLinear()
        .domain([0, 80])
        .range([ height, 0 ]);

      // new y-axis for new data
      svg.append("g")
        .call(d3.axisLeft(y));
      
      // new y-label for new data
      svg.append("text")
          .attr("class", "ylabel")
          .attr("text-anchor", "end")
          .attr("y", 6)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Number of High-Tide Flood Days")
          .style("font-size",22);

      // new chart title for new data
      svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -16)
        .text("Future High-Tide Flooding")
        .style("font-size",24)
        .style("text-anchor", "middle");

      // new path for new data
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", '#ff6961')
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
          .x(function(d) {return x(d.year)})
          .y(function(d) {return y(d.days)})
        )
        .attr('id', 'futurePath');
      
      // delayed transition to give other lines time
      // to disappear
      const transition = d3.transition()
        .delay(1700)
        .ease(d3.easeSin)
        .duration(2500);

      // draw new path
      pathTransition('#futurePath', transition, false);
    }
  )
}

// function for first click of next button
const firstFloodClick = () => {
  // extend line chart
  chartExtension();

  // change slides (caption)
  document.getElementById('flood-slide-1').className = 'hidden';
  document.getElementById('flood-slide-2').className = '';
}

// function for second click of next button
const secondFloodClick = () => {
  // remove current visualization
  removeLineChart();

  // draw new chart
  drawNewChart();

  // change slides (caption)
  document.getElementById('flood-slide-2').className = 'hidden';
  document.getElementById('flood-slide-3').className = '';
}

// function for third click of next button
const finalClick = () => {
  // scroll to next section
  document.getElementById('future-section').scrollIntoView();
}

// function for first click of next button
const firstClick = () => {
  //
  extendPrecipitationChart();

  // change slides (caption)
  document.getElementById('prec-slide-1').className = 'hidden';
  document.getElementById('prec-slide-2').className = '';
}


// function to update charts as a result of next button click
const updateChart = () => {
  if (precipitation) {
    // respond to click with appropriate action
    setClicks(clicks + 1);
    clicks == 1 && firstClick();
    clicks == 2 && finalClick();
  }
  else {
    setClicks(clicks + 1);
    clicks == 1 && firstFloodClick();
    clicks == 2 && secondFloodClick();
    clicks == 3 && finalClick();
  }
}

const drawPrecipitationChart = () => {

  d3.csv("data/heavy_precipitation_1.csv",
    function(d){
      return { 
        years : d.years, 
        inches : d3.format(",.2f")(d.inches)
      }
    }).then( 
      function(data) {
        svg2.selectAll("mybar")
          .data(data)
          .enter()
          .append("rect")
            .attr("x", function(d) { return x2(d.years); })
            .attr("width", x2.bandwidth())
            .attr("height", function() { return height - y2(0); })
            .attr("y", function() { return y2(0); })
            .attr("fill", "#003366")
            
            
        svg2.selectAll('rect')
          .transition()
          .delay(100)
          .duration(2500)
          .attr("y", function(d) { return y2(d.inches); })
          .attr("height", function(d) { return height - y2(d.inches); })
      }
    )
}

const extendPrecipitationChart = () => {
  d3.csv("data/heavy_precipitation_2.csv",
    function(d){
      return { 
        years : d.years, 
        inches : d3.format(",.2f")(d.inches)
      }
    }).then( 
      function(data) {
        
        const newRects = svg2.selectAll("mybar")
          .data(data)
          .enter()
          .append("rect")
            .attr("x", function(d) { return x2(d.years); })
            .attr("width", x2.bandwidth())
            .attr("height", function() { return height - y2(0); })
            .attr("y", function() { return y2(0); })
            .attr("fill", "#003366")
            
            
        newRects
          .transition()
          .duration(2000)
          .attr("y", function(d) { return y2(d.inches); })
          .attr("height", function(d) { return height - y2(d.inches); })
      }
    )
}

// call drawChart() on first render
//drawChart();

