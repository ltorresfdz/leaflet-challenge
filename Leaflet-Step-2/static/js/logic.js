// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  
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

//function to select circle  size depending earthquake magnitude
  function getSize(magnitude) {
    if (magnitude === 0) {
      return 1;
      };

      return magnitude * 4;
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




  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJson(earthquakeData, {
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
      });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define satellite, grayscale and outdoors layers
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
  });
  var plateauline = new L.LayerGroup();

  
    // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Outdoors Map": outdoorsmap,
    "Grayscale Map": grayscalemap,
  };

  

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Plateuline: plateauline
  };

  // Create our map, giving it the gayscalmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3,
    layers: [grayscalemap, earthquakes,plateauline]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Query to retrieve the faultline data
  // Load in geojson data
var plateaulinedata = "static/data/PB2002_plates.json";
  
  // Create the plateulines and add them to the plateuline layer
  d3.json(plateaulinedata, function(data) {
    console.log("si llego aqui");
    console.log(data);
    L.geoJSON(data, {
      style: function() {
        return {color: "orange", fillOpacity: 0}
      }
    }).addTo(plateauline)
  })

  // Add legend to the map
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      levels = ['<1', '1-2', '2-3', '3-4', '4-5', '5+'];
      var colors = ["#98ee00","#d4ee00","#eecc00","#ee9c00","#ea822c","#ea2c2c"];
      
      for (var i = 0; i < levels.length; i++) {
        div.innerHTML += '<i style="background:' + colors[i] + '"></li> ' + levels[i] + '<br>';
    }
     
    
      return div;
  };
  
  legend.addTo(myMap);




}






    

