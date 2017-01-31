function draw(geo_data) {
  "use strict";

  // Sets margin, width and height of the map
  var margin = 50,
      width = 1100 - margin,
      height = 800 - margin;

  // Adds h2 title tag to page
  d3.select("body")
    .append("h2")
    .text("Development of conflicts in Africa: 1997-2015");

  // Creates div with information about the dataset
  var legend = d3.select("body")
    .append("div")
    .attr("class", "legend")

  // Adds some information explaining the data and developments
  legend.append("p")
    .attr("class", "intro")
    .text("Overview of conflicts that occured on the continent of Africa during the \
    years 1997 to 2015. It can be seen that there is a change in the most common \
    conflict area throughout the years. In the early years there are large conflicts \
    seen in Angola and Congo, occuring during the Congo Civil War (1997-1999) in which \
    both countries were involved. In 1999, events in Ethiopia and Eritrea are visible, \
    probably due the Eritrean–Ethiopian War. Between 2000 and 2004, conflicts are visible \
    in Sudan, as there is an ongoing Second Sudanese Civil War. Notable is also Libya in \
    in 2001, in which the Libyan civil war took place. In recent years, many conflicts \
    are taking place in Sudan, Nigeria and to a lesser extent, Somalia. In Sudan these \
    events are likely related to the unstable situation in the country after the \
    independance of South Sudan. In Nigeria the group 'Boko Haram' is causing a lot \
    instability. Finally in Somalia, events are probably related to the fight between \
    government forces and militant Islamist groups. In conclusion it can be said \
    that although Africa still has many conflicts, the continent is in slightly \
    better state than it was 20 years ago. Hover over points to see more \
    information and use the mouse to drag and zoom. Circle size is dependant on \
    number of casulaties. Circle color depends on the type of event, which are as follows:")

  // Text explaining the types of events
  legend.append("b")
    .text("Violence against civilians");

  legend.append("p")
    .text("Violence against civilians occurs \
    when any armed/violent group attacks civilians. By definition, civilians \
    are unarmed and not engaged in political violence.")

  legend.append("b")
    .text("Remote violence");
  legend.append("p")
    .text("Remote violence refers to events in which the tool for \
    engaging in conflict did not require the physical presence \
    of the perpetrator. These include bombings, IED attacks, mortar \
    and missile attacks, etc. ")

  legend.append("b")
    .text("Protests");
  legend.append("p")
    .text("Protests: A protest describes a non-violent, group public \
    demonstration, often against a government institution. ")
  legend.append("b")
    .text("Battle");

  legend.append("p")
    .text("Battle. A battle between two violent armed groups where control \
    of the contested location either changes in favor of government, non-state \
    actors, or does not change hands.");

  // Creates the actual map
  var svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin)
      .attr("height", height + margin)
      .call(d3.behavior.zoom().on("zoom", function () {
        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
      }))
      .append('g')
      .attr('class', 'map');

  // Creates the projection. Azimuthal Equidistant was chosen
  // since this works well for Africa
  var projection = d3.geo.azimuthalEquidistant()
                         .scale(500)
                         .translate([width / 2.5, height / 1.9]);

  var path = d3.geo.path().projection(projection);

  // Data is attached to svg
  var map = svg.selectAll('path')
               .data(geo_data.features)
               .enter()
               .append('path')
               .attr('d', path)
               .style('fill', '#ccebc5')
               .style('stroke', 'black')
               .style('stroke-width', 1);

  // Tooltips are created with the help of a library
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                 return "<span><strong>Fatalities:</strong></span>" +
                 "<span style='color:red'>" + d.FATALITIES + "</span>" + "<br>" +
                 "<span><strong>Location:</strong></span>"  +
                 "<span style='color:red'>" + d.LOCATION + " - " + d.COUNTRY +"</span>" + "<br>" +
                 "<span><strong>Date:</strong></span>" +
                 "<span style='color:red'>" + d.EVENT_DATE + "</span>" + "<br>" +
                 "<span><strong>Event Type:</strong></span>" +
                 "<span style='color:red'>" + d.EVENT_TYPE + "</span>";
               });

  svg.call(tip);

  // Now the conflict data can be loaded and points can be plotted
  // Points with less than 10 fatilities are removed to increase
  // performance and reduce overplotting
  d3.csv("data/conflict.csv", function(d) {
    if (d["FATALITIES"] > 10) {
      return d;
    }
  }, plot_points);

  // Years included in dataset for which buttons need to be created
  var years = ["All Years", 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005,
    2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];

  var buttons = d3.select(".legend")
          .append("div")
          .attr("class", "years_buttons")
          .selectAll("div")
          .data(years)
          .enter()
          .append("div")
          .text(function(d) {
              return d;
          });

  d3.select(".years_buttons")
    .append("h3")
    .text("Total fatilities:")

  // Function that returns color hex values for specific event types
  function color_conflict_types(d) {
      if (d.EVENT_TYPE == "Violence against civilians") {
          return "#e41a1c";
      } else if (d.EVENT_TYPE == "Remote violence") {
          return "#984ea3";
      } else if (d.EVENT_TYPE == "Battle-No change of territory") {
          return "#eff3ff";
      } else if (d.EVENT_TYPE == "Battle-Non-state actor overtakes territory") {
          return "#6a51a3";
      } else if (d.EVENT_TYPE == "Battle-Government regains territory") {
          return "#2171b5";
      } else {
          return '#4daf4a';
      }
  }

  // Function that plots the plot_points
  function plot_points(data) {

    // Calculate max fatalities to use for scaling
    var fatalities_max = d3.max(data, function(d) {
        return d['FATALITIES'];
    });

    // Scales the circles based on fatilities in relation to max
    var radius = d3.scale.sqrt()
                   .domain([0, fatalities_max])
                   .range([0, 5]);

  // Projects each long and latitude to x and y values with help of projection
   data.forEach(function(d) {
       var coords = projection([+d.LONGITUDE, +d.LATITUDE]);
       d['x'] = coords[0];
       d['y'] = coords[1];
   });

   // Sorts events on fatilities values to place larger circles first
   data.sort(function(a, b) {
      return b['FATALITIES'] - a['FATALITIES'];
   })

   // Adds the circles and gives the correct x, y and r values
   // Uses Event_ID as key to recognize events
   svg.append('g')
       .attr("class", "bubble")
       .selectAll("circle")
       .data(data, function(d) {
         return d.EVENT_ID_CNTY
       })
       .enter()
       .append("circle")
       .style('fill', color_conflict_types)
       .attr('cx', function(d) { return d['x']; })
       .attr('cy', function(d) { return d['y']; })
       .attr('r', function(d) {
            return radius(d['FATALITIES']);
       }).on('mouseover', tip.show)
       .on('mouseout', tip.hide);

  // Update function that filters events based on year
  function update(year) {
      if (year == "All Years") {
        d3.select("h2").text("Conflicts in Africa: 1997-2015");
        var filtered = data;
      } else {
        d3.select("h2").text("Conflicts in Africa: " + year);

        var filtered = data.filter(function(d) {
            return +d['YEAR'] === year;
        });
      }

      var circles = svg.selectAll('circle')
                         .data(filtered, function(d) {
                           return d.EVENT_ID_CNTY
                         });

      circles.exit().remove();

      circles.enter()
             .append("circle")
             .style('fill', color_conflict_types)
             .attr('cx', function(d) { return d['x']; })
             .attr('cy', function(d) { return d['y']; })
             .attr('r', function(d) {
                return radius(d['FATALITIES']);
             })

      circles.transition()
             .duration(500)

      circles.on('mouseover', tip.show)
      .on('mouseout', tip.hide);

      // Calculates and shows total fatilities for year
      var totalFatilities = d3.sum(filtered, function(d) {
          return d['FATALITIES'];
      });

      d3.select('h3').text("Total fatilities:" + totalFatilities)
  }

  // Button will call update function, and color of button will get updated after click
  buttons.on("click", function(d) {
      d3.select(".years_buttons")
        .selectAll("div")
        .transition()
        .duration(500)
        .style("color", "black")
        .style("background", "white");

      d3.select(this)
        .transition()
        .duration(500)
        .style("background", "green")
        .style("color", "white");

      update(d);
  });
}
};
