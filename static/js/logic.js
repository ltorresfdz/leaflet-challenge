// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
  });


  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data);
  console.log("finishing reading dataset");
  console.log(data.features[0]);
  console.log(data.features[0].geometry.coordinates[0]); //longitud
  console.log(data.features[0].geometry.coordinates[1]); // latitude
  console.log(data.features[0].properties.place); // place of earthquake
  console.log(data.features[0].properties.mag); // magnitude
 });


// Grabbing our GeoJSON data..
d3.json(queryUrl, function(data) {
    //function to select circle  color depending earthquake magnitude
    function chooseColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#ea2c2c";
        case magnitude >4:
            return "#ea822c";
        case magnitude >3:
            return "#ee9c00";
        case magnitude >2:
            return "#eecc00";
        case magnitude >1:
            return "#d4ee00";
        default:
            return "#98ee00";
            }
        };
     //function to select circle size depending earthquake magnitude
        function styleInfo(feature) {
            return {
              opacity: 1,
              fillOpacity: 1,
              fillColor: chooseColor(feature.properties.mag),
              color: "#000000",
              radius: getSize(feature.properties.mag),
              stroke: true,
              weight: 0.5
            };
        };
   //function to select circle  size depending earthquake magnitude
        function getSize(magnitude) {
            if (magnitude === 0) {
              return 1;
            };
        
            return magnitude * 4;
          };
  
    // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case earthquake magnitude)
       pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        // circle size and color
        style: styleInfo,
        // popup for each marker
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
      }).addTo(myMap);
    
   // Add legend to the map
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend');
      magni = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
      labels =[]
      for (var i = 0; i < magni.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(magni[i] + 1) + '"></i> ' +
            magni[i] + (magni[i + 1] ? '&ndash;' + magni[i + 1] + '<br>' : '+');
    }
     
    magni.forEach(function(m, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
      return div;
  };
  
  legend.addTo(myMap);
    
    
    
    
    
    
    
    
    
    
    
    
    
    });
