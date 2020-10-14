// Creating map object
// function createMap(earthquakes) {





  // Create streetmap tile layer
 var streetmap =  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })

  // create darkmap tile layer
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

// create satellite tile later
var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
  maxZoom: 18,
  subdomains:['mt0','mt1','mt2','mt3']
});

// Create basemap dictionary to be used in control
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Satellite": satellite
};
// Load in geojson data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// function to create circles that are sized and colored
function createCircleMarker( feature, latlng ){
  // Change the values of these options to change the symbol's appearance
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


// Create earthquake plates layergroup to be added to later
var earthquakes = new L.layerGroup();
var plates = new L.layerGroup();

// grab data and and add to earthquake layergroup
var circles = [];
d3.json(url, function(data) {
   L.geoJson(data, {
    pointToLayer: createCircleMarker,
    onEachFeature: onEachFeature
    })
    .addTo(earthquakes);
})

// Create dictionary to be used in control
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Plate Boundaries":plates
};





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









// locate plates geojson
platesfile = "static/tectonicplates-master/GeoJSON/PB2002_boundaries.json"

// Plate style
var myStyle = {
  "color": "yellow",
  "weight": 3,
  "opacity": 0.9
};
// Add plates data to group layer
d3.json(platesfile, function(data) {
  L.geoJSON(data,{
    style: myStyle
  }).addTo(plates)
});

// Create map and add all layers with control
var myMap = L.map("mapid", {
  center: [39.8333,-98.583333],
  zoom: 3,
  layers: [streetmap, earthquakes]
});
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
  }).addTo(myMap);

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
  }
return div;
  }
// Add legend to map
legend.addTo(myMap);