(function() {
  var margin = { top: 140, left: 150, right: 150, bottom: 100},
    height = 800 - margin.top - margin.bottom,
    width = 500 - margin.left - margin.right;

  var svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // list all the options you want to have on your y-axis
  var y_variable_options = ["E","D","C","B","A"]

  // list all the options you want to have on your x-axis
  var category_options = ["category_a", "category_b"]

  // if you want to, you can assign each of your categories along the x-axis a distict color
  var colourScale = d3.scaleOrdinal().domain(category_options).range(['#00CD83','#E8D245'])

  // both the x- and the y-axis are categorical in this example. However, you can of course change it according to your (data's) needs 
  var xPositionScale = d3.scalePoint().domain(category_options).range([60,width])
  var yPositionScale = d3.scalePoint().domain(y_variable_options).range([height,20])

  // here you define the size of the bubbles, the range of the input data (domain) is defined upon reading in the data
  // but in this place you can define what the minimum and the maximum radius of your circles should be 
  var circleRadiusScale = d3.scaleSqrt().range([1,50]);

  d3.queue()
    .defer(d3.csv, "data-bubble.csv", function(d){
      d.y_variable = d.y_variable
      d.category = d.category
      d.datapoint = +d.datapoint
      return d

    })
    .await(ready)

  function ready(error, datapoints) {

    // find the biggest and smalles value
    var datapoint_max =  d3.max(datapoints, function(d) { return d.datapoint });
    var datapoint_min =  d3.min(datapoints, function(d) { return d.datapoint });

    // update the scale: mind how domain and range play together here:
    // if you set the range minimum to 1 and the minimum of the domain to the smallest value
    // the circles won't be visible. If you want 1 to be your smallest radius through, then you need to set 
    // the minimum of the domain to 0, as done below
    circleRadiusScale.domain([datapoint_min - (datapoint_min), datapoint_max]);

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", function(d){
        return circleRadiusScale(d.datapoint)
      })
      .attr("cx", function(d){
        return xPositionScale(d.category)
      })
      .attr("cy", function(d){
        return yPositionScale(d.y_variable)
        // sort
      })
      .attr("fill", function(d){
        return colourScale(d.category)
      })

    // Adding datapoint as label
    svg.selectAll("text")
      .data(datapoints)
      .enter().append("text")
      .attr("text-anchor", "end")
      .text(function(d){
        return d.datapoint
      })
      .attr("x", function(d){
         return xPositionScale(d.category)
      })
      .attr("y", function(d){
         return yPositionScale(d.y_variable)
      })
      // positioning the thex labels
      .attr("dy", ".35em")
      .attr("dx", ".70em")
      .style("fill", "#FFFFFF")
      .style("font-family", "Noto Sans")
      .style("font-size", "12px");

    // Adding  axes
    var xAxis = d3.axisTop(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0,0)")
      .call(xAxis)
      .selectAll("text")
      .attr("y", -50)
      .attr("x", 0)
      .style("font-family", "Noto Sans")
      .style("font-size", "14px")
      .attr("transform", "rotate(0)");

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .style("font-family", "Noto Sans")
      .style("font-size", "14px")
      .attr("transform", "translate(0,0)")
      .call(yAxis);

  
  }

})();
