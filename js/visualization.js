// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 


let margin = {
  top: 60,
  left: 100,
  right: 200,
  bottom: 35
},
width = 1000 - margin.left - margin.right,
height = 1000 - margin.top - margin.bottom;

const svg = d3.select("#vis-svg-1")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);

const x = d3.scaleTime()
      .domain([d3.timeParse("%Y")(1920), d3.timeParse("%Y")(2010)])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Decade")
    .style("font-size",22);

    // add y-axis to inner top-left corner 
    const y = d3.scaleLinear()
      // assign max according to silver bc the overall max of the dataset is in the silver column
      .domain([0, 160])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Number of High-Tide Flood Days")
      .style("font-size",22);

    // add a title in the top-center of chart
    svg.append("text")
      .attr("x", width / 2 )
      .attr("y", -16)
      .text("High-Tide Flooding")
      .style("font-size",30)
      .style("text-anchor", "middle");

    // add a legend to the right of the chart
    svg.append("circle")
      .attr("cx",745)
      .attr("cy",30)
      .attr("r", 6)
      .style("fill", "red")
    svg.append("circle")
      .attr("cx",745)
      .attr("cy",55)
      .attr("r", 6)
      .style("fill", "#0096FF")
    svg.append("text")
      .attr("x", 755)
      .attr("y", 30)
      .text("Boston")
      .style("font-size", 20)
      .attr("alignment-baseline","middle")
    svg.append("text")
      .attr("x", 755)
      .attr("y", 55)
      .text("National Avg.")
      .style("font-size", 20)
      .attr("alignment-baseline","middle")

const drawChart = () => {

  d3.csv("data/high_tide_flooding_1.csv",
  // return data as object
  function(d){
    return { 
      decade : d3.timeParse("%Y")(d.decade), 
      boston : d.boston, 
      national : d.national, 
    }
  }).then(
  
  function(data) {

    // add a gold line for the gold medal data per year
    const bostonPath = svg.append("path")
                        .datum(data)
                        .attr("fill", "none")
                        .attr("stroke", "red")
                        .attr("stroke-width", 2.5)
                        .attr("d", d3.line()
                          .x(function(d) { return x(d.decade) })
                          .y(function(d) { return y(d.boston) })
                          )

    // add a silver line for the silver medal data per year
    const nationalPath = svg.append("path")
                          .datum(data)
                          .attr("fill", "none")
                          .attr("stroke", '#0096FF')
                          .attr("stroke-width", 2.5)
                          .attr("d", d3.line()
                            .x(function(d) {return x(d.decade)})
                            .y(function(d) {return y(d.national)})
                            )
  const bostonPathLength = bostonPath.node().getTotalLength()
  const nationalPathLength = nationalPath.node().getTotalLength()

  const transitionPath = d3
    .transition()
    .delay(500)
    .ease(d3.easeSin)
    .duration(2500);

  bostonPath
    .attr("stroke-dasharray", bostonPathLength)
    .attr("stroke-dashoffset", bostonPathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0)

  nationalPath
    .attr("stroke-dasharray", nationalPathLength)
    .attr("stroke-dashoffset", nationalPathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0)
})

};

const updateChart = () => {
  d3.csv("data/high_tide_flooding_2.csv",
  // return data as object
  function(d){
    return { 
      decade : d3.timeParse("%Y")(d.decade), 
      boston : d.boston, 
      national : d.national
    }
  }).then(
  
  function(data) {
    const bostonPath = svg.append("path")
                        .datum(data)
                        .attr("fill", "none")
                        .attr("stroke", "red")
                        .attr("stroke-width", 2.5)
                        .attr("d", d3.line()
                          .x(function(d) { return x(d.decade) })
                          .y(function(d) { return y(d.boston) })
                          )

    const nationalPath = svg.append("path")
                          .datum(data)
                          .attr("fill", "none")
                          .attr("stroke", '#0096FF')
                          .attr("stroke-width", 2.5)
                          .attr("d", d3.line()
                            .x(function(d) {return x(d.decade)})
                            .y(function(d) {return y(d.national)})
                            )
    const bostonPathLength = bostonPath.node().getTotalLength()
    const nationalPathLength = nationalPath.node().getTotalLength()

    const transitionPath = d3
      .transition()
      .delay(200)
      .ease(d3.easeSin)
      .duration(2500);

    bostonPath
      .attr("stroke-dasharray", bostonPathLength)
      .attr("stroke-dashoffset", bostonPathLength)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0)

    nationalPath
      .attr("stroke-dasharray", nationalPathLength)
      .attr("stroke-dashoffset", nationalPathLength)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0)
  })
}


drawChart();

