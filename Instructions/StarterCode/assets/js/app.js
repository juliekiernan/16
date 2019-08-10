// create scatter plot; heathcare vs. poverty; smokers vs. age; income vs. obesity
// state abbrev in circles
// situate axes on left and bottom

// create svg element
var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create Params for charts
// X Constants
var poverty_x_axis = 'poverty';
var age_x_axis = 'age';
var income_x_axis = 'income';

// Y Constants
var obese_y_axis = 'obesity';
var smoke_y_axis = 'smokes';
var lacks_healthcare_y_axis = 'healthcare';

// x-scale var upon click
// var current_X_axis = poverty_x_axis;
// var current_Y_axis = lacks_healthcare_y_axis;

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv", function(err, healthData) {
  if(err) throw err;
  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(healthData, d => d[current_X_axis])])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d[current_Y_axis])])
    .range([height, 0]);

  // Create axis functions
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  var xAxis = chartGroup.append('g')
    .classed('x-axis', true)
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  
  var yAxis = chartGroup.append('g')
    .classed('y-axis', true)
    .call(yAxis);

  // Create Circles
  var circlesGroup = chartGroup.selectAll('circle')
    .data(healthData)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d[current_X_axis]))
    .attr('cy', d => yLinearScale(d[current_Y_axis]))
    .attr('r', '15')
    .attr('class','stateCircle')

  // Create group for the 3 x-axis labels
  var labelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${width / 2}, ${height + 20})`);
    // group1- x
    var poverty_label = labelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty') // value to grab for event listener
      .classed('active', true)
      .text('In Poverty (%)');
    // group2- x
   var age_label = labelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'age') // value to grab for event listener
      .classed('inactive', true)
      .text('Age (Median)');
    // group3- x
    var income_label = labelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 60)
      .attr('class', 'axisText')
      .attr('value', 'income') // value to grab for event listener
      .classed('inactive', true)
      .text('Household Income (Median)');

    // Create groups for the 3 y-axis labels
    var y_labelsGroup = chartGroup.append('g')
      .attr('transform', 'rotate(-90)')

    // group1- y
    var healthcare_label = y_labelsGroup.append('text')
      .attr('y', -50 )
      .attr('x', -150)
      .attr('dy', '1em')
      .attr('class', 'axisText')
      .attr('value', 'healthcare') // value to grab for event listener
      .classed('active', true)
      .text('Lacks Healthcare (%)');
    // group2- y
    var obese_label = y_labelsGroup.append('text')
      .attr('y', -75 )
      .attr('x', -150)
      .attr('dy', '1em')
      .attr('class', 'axisText')
      .attr('value', 'obesity') // value to grab for event listener
      .classed('inactive', true)
      .text('Obese (%)');
    // group3- y
      var smokes_label = y_labelsGroup.append('text')
        .attr('y', -100 )
        .attr('x', -150)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .attr('value', 'smokes') // value to grab for event listener
        .classed('inactive', true)
        .text('Smokes (%)');

    // update bubbles with state
    var circlesGroup = updateToolTip(current_X_axis, current_Y_axis, circlesGroup);
    var state_text = chartGroup.selectAll('stateText')
      .data(healthData)
      .enter()
      .append('text')
      .attr('dx', d => ((xLinearScale(d[current_X_axis]))))
      .attr('dy', d => (yLinearScale(d[current_Y_axis])))
      .text(function(d) { return d.abbr;})
      .attr('class', 'stateText')

// EVENT LISTENERS
labelsGroup.selectAll('text')
  .on('click', function() {
  // get value of selection
  var value = d3.select(this).attr('value');
  // X AXIS EVENT LISTENER
  if (value !== current_X_axis) {
    // replace current_X_axis with value
    current_X_axis = value;
    // update x scale for new data
    var xScale = d3.scaleLinear()
      .domain([8, d3.max(health_data, d => d[current_X_axis])])
      .range([0, width]);
    // update x axis with transition
    xAxis.transition()
      .duration(1000)
      .call(d3.axisBottom(xScale));
    // update circles with new x values
    circlesGroup.transition()
      .duration(1000)
      .attr('cx', d => xScale(d[current_X_axis]));
    // update STATE TEXT with new x values
    state_text.transition()
      .duration(1000)
      .attr('dx', d => (xScale(d[current_X_axis])));
    // update tooltips with new info
    circlesGroup = updateToolTip(current_X_axis, current_Y_axis, circlesGroup);
    // change classe to change bold text
    if (current_X_axis === 'age') {
        age_label
          .classed('active', true)
          .classed('inactive', false);
        income_label
          .classed('active', false)
          .classed('inactive', true);
        poverty_label
          .classed('active', false)
          .classed('inactive', true);
        } 
      else if (current_X_axis === 'income') {
        age_label
          .classed('active', false)
          .classed('inactive', true);
        income_label
          .classed('active', true)
          .classed('inactive', false);
        poverty_label
          .classed('active', false)
          .classed('inactive', true);
        } 
      else {
        age_label
          .classed('active', false)
          .classed('inactive', true);
        income_label
          .classed('active', false)
          .classed('inactive', true);
        poverty_label
          .classed('active', true)
          .classed('inactive', false);
      };
    } 
    // update tooltips with new info
    circlesGroup = updateToolTip(current_X_axis, current_Y_axis, circlesGroup);
  });

 // Y EVENT LISTENER  
 if (value !== current_Y_axis) {
  // current_Y_axis with value
  current_Y_axis = value;
  // update Y scale for new data
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(health_data, d => d[current_Y_axis])])
    .range([height, 0]);
  
    // update y axis with transition
  yAxis.transition()
    .duration(1000)
    .call(d3.axisLeft(yScale));

  // update circles with new y values
  circlesGroup.transition()
    .duration(1000)
    .attr('cy', d => yScale(d[current_Y_axis]));

  // update STATE TEXT with new y values
  state_text.transition()
    .duration(1000)
    .attr('dy', d => (yScale(d[current_Y_axis])));

  // change classes to change bold text
   if (current_Y_axis === 'obesity') {
      obese_label
        .classed('active', true)
        .classed('inactive', false);
      smokes_label
        .classed('active', false)
        .classed('inactive', true);
      healthcare_label
        .classed('active', false)
        .classed('inactive', true);
      } 
    else if (current_Y_axis === 'smokes') {
      obese_label
        .classed('active', false)
        .classed('inactive', true);
      smokes_label
        .classed('active', true)
        .classed('inactive', false);
      healthcare_label
        .classed('active', false)
        .classed('inactive', true);
      } 
    else {
      obese_label
        .classed('active', false)
        .classed('inactive', true);
      smokes_label
        .classed('active', false)
        .classed('inactive', true);
      healthcare_label
        .classed('active', true)
        .classed('inactive', false);
      };
  } 
    // update tooltips with new info
    circlesGroup = updateToolTip(current_X_axis, current_Y_axis, circlesGroup);
  });



// Helper Functions
// function to update circles group with new tooltip
function updateToolTip(current_X_axis, current_Y_axis, circlesGroup) {
  var x_label;
  if (current_X_axis === 'poverty') {
    x_label = '% in Poverty'
    } 
  else if (current_X_axis === 'age') {
    x_label = 'Average Age'
    } 
  else {
    x_label = 'Median Income<br>$'
  }
  
  var y_label;
  if (current_Y_axis === 'obesity') {
    y_label = '% Obese'
    } 
  else if (current_Y_axis === 'smokes') {
    y_label = '% Smokes'
    } 
  else {
    y_label = '% lacking Healthcare'
    }

// Initialize tool tip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([80, -60])
    .html(d => `${d.state}<br>${x_label} ${d[current_X_axis]} <br> ${y_label} ${d[current_Y_axis]}`);

// Event listener to display and hide the tooltip
circlesGroup.call(toolTip);
circlesGroup.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);
  return circlesGroup;
}