// Creating map object
// function createMap(earthquakes) {


  var myMap = L.map("mapid", {
      center: [39.8333,-98.583333],
      zoom: 3,
  });


  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);


// geojson link
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// function to create circles that are sized and colored
function createCircleMarker( feature, latlng ){
  var options = {
    radius: feature.properties.mag*2,
    fillColor: getColor(feature['geometry']['coordinates'][2]),
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.95
  }
  return L.circleMarker( latlng, options );
}

// function that creates the popup info
function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

// grab data and plot using functions
var circles = d3.json(url, function(data) {
  console.log(data.features[0]['geometry']['coordinates'][2]);
  // createFeatures(data.features);
  L.geoJSON(data, {
    pointToLayer: createCircleMarker,
    onEachFeature: onEachFeature
      
    }
  ).addTo(myMap)

})


// function that assigns color
function getColor(d) {
  return d > 90 ? '#800026' :
         d > 70  ? '#BD0026' :
         d > 50  ? '#E31A1C' :
         d > 30  ? '#FC4E2A' :
         d > 10   ? '#FD8D3C' :
         d > -10   ? '#FEB24C' :
                    '#FFEDA0';
}

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend'),
  grades = [-10, 10, 30, 50, 70, 90];

// loop through color intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<li style=\"background-color: " + getColor(grades[i]) + "\"></li>" +
        " " + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<ul>' : '+')
          // grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

return div;
  }
legend.addTo(myMap);

// locate plates geojson
plates = "static/tectonicplates-master/GeoJSON/PB2002_boundaries.json"

// Plate style
var myStyle = {
  "color": "yellow",
  "weight": 3,
  "opacity": 0.9
};
// plot plates data
d3.json(plates, function(data) {
  // createFeatures(data.features);
  L.geoJSON(data,{
    style: myStyle
  }).addTo(myMap).bringToBack()

});