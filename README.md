# Data Analyst P5 Data Visualization - Jasper Alblas

## Summary

This visualization shows the occurrences of conflicts on the continent of Africa between the years 1997 and 2015. The location of the events are mapped on the map of Africa, while more details are shown by hovering over the event's circle. The data can be filtered by year by using the buttons. Finally, panning and zooming is done by the use of the mouse.

## Design - explain any design choices you made including changes to the visualization after collecting feedback

I started the design process by simply finding a usable GeoJSON file to show Africa. I continued by plotting the data on the map. I decided to give the map a natural color, while the points are given a more flashy color to create enough contrast. This lead to the first version of the visualization, which can be found in the "part1" folder.

After the first feedback, I started implementing the ability to hover over points to see more information regarding the conflict. This made the visualization much more interesting, as information is now shown regarding the date and event type. In addition, due to the great amount of data, it was found useful to be able to filter the data by year. This would provide more value by showing developments through time, as well as making it more easy to look at individual points, as showing all points does look slightly crowded. The buttons to filter are added to the top to make them easy to spot. This lead to the second version of the visaluzation, which can be found in the "part2" folder.

The third iteration of the visualization was focused on "nice-to-haves". After the final feedback, I decided to add the simple ability to zoom in and pan the map. This makes it easier to select the correct point in many cases. Finally, the title and subitle were updated, and some other minor appearance changes were made. This lead to the final version. Final feedback included suggestion to filter by country, but I have decided to leave this for now as roughly same functionality can be achieved by zooming in.

The fourth iteration was made after the first review. The different event types now have different colors to distinguish
between them. In addition, some context is added in the intro and total casualty numbers are shown per year.

## Feedback - include all feedback you received from others on your visualization from the first sketch to the final visualization

As all feedback was done in person, and in other languages than English, I will paraphrase the three rounds of feedback received.

1. (After part1) Nice map. Lots of info, but would like to see more and ability to zoom to see conflicts better. Would like to see which countries the events took place.
2. (After part1) Roughly similar to feedback #1. Would like to see more context and developments over time. Need for more description.
3. (After part2) Awesome. Would be nice to be able to zoom in as some events are hard to select, especially when showing everything. Perhaps show events by country?

## Resources - list any sources you consulted to create your visualization

- The dataset used was found at: http://www.acleddata.com/data/version-6-data-1997-2015/
- The GeoJSON file of Africa was found at: https://geojson-maps.ash.ms/
- Color scheme inspiration found at: http://colorbrewer2.org/#type=qualitative&scheme=Set1&n=5
