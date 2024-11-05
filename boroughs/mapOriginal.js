//=========================================================== MAP SETUP =================================================================
var maps = {};

// MAP OBJECT
maps["demographicLanguageMap"] = L.map("demographicLanguageMap", {
  maxBounds: bounds, // Map automatically bounces back to center
  maxZoom: 18,
  minZoom: 11.5,
  zoomSnap: ZOOM_INCREMENT,
  zoomDelta: ZOOM_INCREMENT,
}).setView([40.65, -73.97], INITIAL_ZOOM_LEVEL);

// BASEMAP
var baseLayer = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2hlZW5hcCIsImEiOiJja25hdXE3aGcxbGI4MnVxbnFoenhwdGRrIn0.DhFwD-KlRigYLaVwL8ipGA",
  }
).addTo(maps["demographicLanguageMap"]);


//=========================================================== OVERLAYS =================================================================
// Toggle non-interactive overlay maps


var zipGroup = new L.layerGroup(); //
//var CDgroup = new L.layerGroup(); //

function combineZipData(geoData, summaries) {
  geoData.features.forEach((feature) => {
    var match = summaries.find(
      (summary) => summary["Zip Code"] === parseInt(feature.properties.ZIPCODE)
    );
    if (match) {
      Object.assign(feature.properties, match);
    }
  });
  return geoData;
}

var zipCodeOverlay = L.geoJson(combineZipData(zipCodeBoundaries, zipCodeData), {
  filter: function (feature) {
      return feature.properties.COUNTY == COUNTY_NAME;
    },

  style: {
  "color": "#ededed",
  "weight": 5,
  "opacity": 0.65
},
  onEachFeature: function(feature, layer) {
    //ADD POP UP
    layer.bindPopup('<h3> Zip code: ' + feature.properties.ZIPCODE + '<p>The estimated total population of people living in <strong>' + feature.properties.ZIPCODE + ' (' + feature.properties.Neighborhood + ') ' +
                '</strong> is <strong>' + parseInt(feature.properties["2022 Total Population"]).toLocaleString("en-US") + '</strong>.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
    layer.on('mouseover', function() {
        layer.setStyle({
            fillOpacity: 0.8
        })
    })
    layer.on('mouseout', function() {
        layer.setStyle({
            fillOpacity: 0.2
        })
    });
// }).addTo(zipGroup)
//ADD LABELS
  if (feature.geometry.type === 'Polygon') {
      label = String(feature.properties.ZIPCODE)
      var centroid = turf.centroid(feature);
      var lon = centroid.geometry.coordinates[0];
      var lat = centroid.geometry.coordinates[1];
      return new L.CircleMarker([lat,lon]).bindTooltip(label, {permanent: true, opacity: 1, direction:'center'}).openTooltip().addTo(zipGroup);
  }
  }
}).addTo(zipGroup)

var boundaries = {
    "See Zip Codes": zipGroup
}


//=========================================================== CONFIGURATION =================================================================
// Update language colors on the map
const languageColors = [
  "#00441b",
  "#006d2c",
  "#238b45",
  "#41ae76",
  "#66c2a4",
  "#99d8c9",
  "#ccece6",
  "#606060",
];
// Update layer and legend name for health risk map
const healthRiskLayerNames = {
  UNINSURED: "Uninsured",
  FREQUENT_DRINKERS: "Frequent Drinkers",
  CURRENT_SMOKERS: "Current Smokers",
  SEDENTARY_LIFESTYLE: "Sedentary Lifestyle",
  SLEEP_LESS_THAN_7_HOURS: "<7 Hours Sleep",
};

// Update color for health risk map
const healthRiskColors = [
  "#034e7b",
  "#0570b0",
  "#3690c0",
  "#74a9cf",
  "#a6bddb",
  "#d0d1e6",
  "#f1eef6",
  "#f1eef6",
  "#606060",
];

// Update layer and legend name for health outcomes map
const healthOutcomesLayerNames = {
  ASTHMA_PREVALENCE: "Asthma Prevalence",
  HIGH_BLOOD_PRESSURE: "High Blood Pressure",
  CANCER_PREVALENCE: "Cancer Prevalence",
  HIGH_CHOLESTEROL: "High Cholesterol",
  CHRONIC_KIDNEY_DISEASE: "Chronic Kidney Disease",
  PULMONARY_DISEASE: "Pulmonary Disease",
  HEART_DISEASE: "Heart Disease",
  DIABETES_PREVALENCE: "Diabetes Prevalence",
  OBESITY_PREVALENCE: "Obesity Prevalence",
  STROKE_PREVALENCE: "Stroke Prevalence",
};

// Update color for health outcomes map
const healthOutcomesColors = [
  "#91003f",
  "#ce1256",
  "#e7298a",
  "#df65b0",
  "#c994c7",
  "#d4b9da",
  "#e7e1ef",
  "#e7e1ef",
  "#606060",
];

// Update layer and legend name for screening rates map
const screeningRatesLayerNames = {
  ANNUAL_CHECKUP: "Annual Checkup",
  DENTAL_VISIT: "Dental Visit",
  CHOLESTEROL_SCREENING: "Cholesterol Screening",
  MAMMOGRAPHY_SCREENING: "Mammography Screening",
  CERVICAL_SCREENING: "Cervical Screening",
  COLORECTAL_SCREENING: "Colorectal Screening",
};

// Update color for screening rates map
const screeningRatesColors = [
  "#6e016b",
  "#88419d",
  "#8c6bb1",
  "#8c96c6",
  "#9ebcda",
  "#bfd3e6",
  "#edf8fb",
  "#edf8fb",
  "#606060",
];

// Update layer and legend name for health status map
const healthStatusLayerNames = {
  DEPRESSION: "Depression Prevalence",
  MENTAL_HEALTH_BAD: "Mental Health Distress Prevalence",
  PHYSICAL_HEALTH_BAD: "Physical Health Distress Prevalence",
  POOR_SELF_RATED_HEALTH: "Fair or Poor Health",
  DISABILITY: "Disability Prevalence",
  HEARING_DISABILITY: "Hearing Disability Prevalence",
  VISION_DISABILITY: "Vision Disability prevalence",
  COGNITIVE_DISABILITY: "Cognitive Disability prevalence",
  MOBILITY_DISABILITY: "Mobility Disability prevalence",
  SELF_CARE_DISABILITY: "Self-care Disability prevalence",
  INDEPENDENT_LIVING_DISABILITY: "Independent Living Disability Prevalence",
};

// Update color for health status map
const healthStatusColors = [
  "#662506",
  "#993404",
  "#cc4c02",
  "#ec7014",
  "#fe9929",
  "#fec44f",
  "#fee391",
  "#fff7bc",
  "#606060",
];

// Feature will be applied to all maps
var highlightedFeature;
function allFeatures(feature, layer) {
  // Highlight effect
  layer.on("mouseover", function () {
    layer.setStyle({
      fillOpacity: 0.3,
    });
  });
  layer.on("mouseout", function () {
    layer.setStyle({
      fillOpacity: 0.8,
    });
  });

  // Outline effect
  layer.on("click", function (e) {
    var layer = e.target;
    // Reset style of previous feature
    if (highlightedFeature) {
      highlightedFeature.setStyle({
        color: "white",
        weight: 0.5,
      });
    }

    // Outline style
    layer.setStyle({
      color: "cyan",
      weight: 5,
    });

    // Store last feature
    highlightedFeature = layer;
  });
}

//=========================================================== LANGUAGE =================================================================
var selectedLayer = "language";
var languageControl;
var mymap = maps["demographicLanguageMap"];
// Create a FeatureGroup for language layers
var languageGroup = new L.featureGroup().addTo(mymap);

// Predominant language legend
var languageLegend = L.control({
  position: "bottomleft",
});

languageLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");

  // Color boxes and labels for each language
  div.innerHTML += "<h4>Predominant Languages</h4>";
  div.innerHTML +=
    '<i style="background: #f7d9b6ff"></i><span>Arabic</span><br>';
  div.innerHTML +=
    '<i style="background: #963f92ff"></i><span>Chinese</span><br>';
  div.innerHTML +=
    '<i style="background: #30bfc7ff"></i><span>French, Haitian Creole, or Cajun</span><br>';
  div.innerHTML +=
    '<i style="background: #3288bd"></i><span>German or other West Germanic languages</span><br>';
  div.innerHTML += '<i style="background: #e7298a"></i><span>Korean</span><br>';
  div.innerHTML +=
    '<i style="background: #f0d36e"></i><span>Other and unspecified languages</span><br>';
  div.innerHTML +=
    '<i style="background: #795cb8"></i><span>Other Asian and Pacific Island languages</span><br>';
  div.innerHTML +=
    '<i style="background: #507587"></i><span>Other Indo-European languages</span><br>';
  div.innerHTML +=
    '<i style="background: #e28513ff"></i><span>Russian, Polish, or other Slavic languages</span><br>';
  div.innerHTML +=
    '<i style="background: #41ab5d"></i><span>Spanish</span><br>';
  div.innerHTML +=
    '<i style="background: #eb554dff"></i><span>Tagalog (incl. Filipino)</span><br>';
  div.innerHTML +=
    '<i style="background: #c7e9b4"></i><span>Vietnamese</span><br>';
  return div;
};

languageLegend.addTo(mymap);

// Function to format neighborhood names
function formatNeighborhoodName(name) {
  const firstSpaceIndex = name.indexOf(" ");
  const lastParenIndex = name.lastIndexOf("(");

  return name.substring(firstSpaceIndex + 1, lastParenIndex).trim();
}

// Function to update map based on selected language from the dropdown
function updateMap() {
  // Get selected language from the dropdown
  var selectedLanguage = document.getElementById("languageSelect").value;

  // Clear existing layer
  languageGroup.clearLayers();

  // Add new layer based on the selected language
  var selectedLanguageGeojson = L.geoJson(languageGeoJsonData, {
    filter: function (feature) {
      return feature.properties.boroname == BORO_NAME;
    },

    style: function (feature) {
      var style;
      if (selectedLanguage == "") {
        // Default style for predominant language (if no language is selected)
        style = {
          fillColor: getColorBasedOnLanguageLegend(
            feature.properties.Predominant
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else {
        var numberOfSpeakers = 0;
        switch (selectedLanguage) {
          case "Arabic":
            numberOfSpeakers = feature.properties.Arabic;
            style = {
              fillColor: getColorForArabic(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Chinese":
            numberOfSpeakers = feature.properties.Chinese;
            style = {
              fillColor: getColorForChinese(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "French, Haitian Creole, or Cajun":
            numberOfSpeakers = feature.properties.French;
            style = {
              fillColor: getColorForFrench(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "German or other West Germanic languages":
            numberOfSpeakers = feature.properties.German;
            style = {
              fillColor: getColorForGerman(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Korean":
            numberOfSpeakers = feature.properties.Korean;
            style = {
              fillColor: getColorForKorean(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Other and unspecified languages":
            numberOfSpeakers = feature.properties.Other;
            style = {
              fillColor: getColorForOther(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Other Asian and Pacific Island languages":
            numberOfSpeakers = feature.properties.Other_Asia;
            style = {
              fillColor: getColorForOtherAsia(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Other Indo-European languages":
            numberOfSpeakers = feature.properties.Other_Indo;
            style = {
              fillColor: getColorForOtherIndo(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Russian, Polish, or other Slavic languages":
            numberOfSpeakers = feature.properties.Russian;
            style = {
              fillColor: getColorForRussian(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Spanish":
            numberOfSpeakers = feature.properties.Spanish;
            style = {
              fillColor: getColorForSpanish(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Tagalog (incl. Filipino)":
            numberOfSpeakers = feature.properties.Tagalog;
            style = {
              fillColor: getColorForTagalog(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
          case "Vietnamese":
            numberOfSpeakers = feature.properties.Vietnamese;
            style = {
              fillColor: getColorForVietnamese(numberOfSpeakers),
              weight: 0.5,
              opacity: 1,
              color: "white",
              fillOpacity: 0.8,
            };
            break;
        }
      }
      return style;
    },

    // Adding a popup for each features
    onEachFeature: function (feature, layer) {
      var p = feature.properties;
      var cdtanameClean = formatNeighborhoodName(p.cdtaname);

      var popupContent;
      if (selectedLanguage == "") {
        // Default popup content for predominant language
        popupContent =
          "<h3>" + p.Geographic + "</h3>" + "<h5>(" + cdtanameClean + ")</h5>";

        if (p.Estimate == "no data") {
          popupContent += `No data avavailable for this Census Tract`;
        } else {
          popupContent +=
            "Approximately <b>" +
            parseInt(p.Total_pop).toLocaleString("en-US") +
            "</b> people live in <b>" +
            p.Geographic +
            "</b>, and around <b>" +
            (p.Speak_anot * 100).toFixed(1) +
            "%</b> of these residents speak a language other than English. The predominant non-English spoken language is: <b>" +
            p.Predominant +
            "</b>";
        }
      } else {
        // Popup content for selected language
        popupContent =
          "<h3>" + p.Geographic + "</h3>" + "<h5>(" + cdtanameClean + ")</h5>";

        if (p.Estimate == "no data") {
          popupContent += `No data avavailable for this Census Tract`;
        } else {
          switch (selectedLanguage) {
            case "Arabic":
              popupContent += `<p>Number of Arabic speakers: <b>${
                p.Arabic
              }</b></p>
              <p>Percentage of population speaking Arabic who are not fluent English speakers: <b>${(
                p.Arabic_nf * 100
              ).toFixed(1)}%
              </b></p>`;
              break;

            case "Chinese":
              popupContent += `<p>Number of Chinese speakers: <b>${
                p.Chinese
              }</b></p>
                <p>Percentage of population speaking Chinese who are not fluent English speakers: <b>${(
                  p.Chinese_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "French, Haitian Creole, or Cajun":
              popupContent += `<p>Number of French, Haitian Creole, or Cajun speakers: <b>${
                p.French
              }</b></p>
                <p>Percentage of population speaking French, Haitian Creole, or Cajun who are not fluent English speakers: <b>${(
                  p.French_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "German or other West Germanic languages":
              popupContent += `<p>Number of German or other West Germanic languages speakers: <b>${
                p.German
              }</b></p>
                <p>Percentage of population speaking German or other West Germanic languages who are not fluent English speakers: <b>${(
                  p.German_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Korean":
              popupContent += `<p>Number of Korean speakers: <b>${
                p.Korean
              }</b></p>
                <p>Percentage of population speaking Korean who are not fluent English speakers: <b>${(
                  p.Korean_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Other and unspecified languages":
              popupContent += `<p>Number of Other and unspecified languages speakers: <b>${
                p.Other
              }</b></p>
                <p>Percentage of population speaking Other and unspecified languages who are not fluent English speakers: <b>${(
                  p.Other_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Other Asian and Pacific Island languages":
              popupContent += `<p>Number of speakers of Other Asian and Pacific Island languages: <b>${
                p.Other_Asia
              }</b></p>
                <p>Percentage of population speaking Other Asian and Pacific Island languages who are not fluent English speakers: <b>${(
                  p.Other_Asia_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Other Indo-European languages":
              popupContent += `<p>Number of speakers of Other Indo-European languages: <b>${
                p.Other_Indo
              }</b></p>
                <p>Percentage of population speaking Other Indo-European languages who are not fluent English speakers: <b>${(
                  p.Other_Indo_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Russian, Polish, or other Slavic languages":
              popupContent += `<p>Number of Russian, Polish, or other Slavic languages speakers: <b>${
                p.Russian
              }</b></p>
                <p>Percentage of population speaking Russian, Polish, or other Slavic languages who are not fluent English speakers: <b>${(
                  p.Russian_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Spanish":
              popupContent += `<p>Number of Spanish speakers: <b>${
                p.Spanish
              }</b></p>
                <p>Percentage of population speaking Spanish who are not fluent English speakers: <b>${(
                  p.Spanish_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Tagalog (incl. Filipino)":
              popupContent += `<p>Number of Tagalog speakers: <b>${
                p.Tagalog
              }</b></p>
                <p>Percentage of population speaking Tagalog who are not fluent English speakers: <b>${(
                  p.Tagalog_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Vietnamese":
              popupContent += `<p>Number of Vietnamese speakers: <b>${
                p.Vietnamese
              }</b></p>
                <p>Percentage of population speaking Vietnamese who are not fluent English speakers: <b>${(
                  p.Vietnamese_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;
          }
        }
      }

      var popup = L.responsivePopup().setContent(popupContent);

      layer.bindPopup(popup);

      allFeatures(feature, layer);
    },
  }).addTo(languageGroup);

  // Update the legend based on the selected layer and language
  selectedLayer = "language";
  updateLegend(selectedLayer, selectedLanguage);
  bringZipLayersToFront();
}

var LanguageControl = L.Control.extend({
  // Position
  options: {
    position: "topright",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div");

    var select = L.DomUtil.create("select", "", container);
    // ID = languageSelect
    select.id = "languageSelect";
    select.onchange = updateMap;

    // Define languages for dropdown
    var languages = [
      { value: "", text: "Predominant Languages" },
      { value: "Arabic", text: "Arabic" },
      { value: "Chinese", text: "Chinese" },
      {
        value: "French, Haitian Creole, or Cajun",
        text: "French, Haitian Creole, or Cajun",
      },
      {
        value: "German or other West Germanic languages",
        text: "German or other West Germanic languages",
      },
      { value: "Korean", text: "Korean" },
      {
        value: "Other and unspecified languages",
        text: "Other and unspecified languages",
      },
      {
        value: "Other Asian and Pacific Island languages",
        text: "Other Asian and Pacific Island languages",
      },
      {
        value: "Other Indo-European languages",
        text: "Other Indo-European languages",
      },
      {
        value: "Russian, Polish, or other Slavic languages",
        text: "Russian, Polish, or other Slavic languages",
      },
      { value: "Spanish", text: "Spanish" },
      { value: "Tagalog (incl. Filipino)", text: "Tagalog (incl. Filipino)" },
      { value: "Vietnamese", text: "Vietnamese" },
    ];

    // Populate dropdown
    for (var i = 0; i < languages.length; i++) {
      var option = L.DomUtil.create("option", "", select);
      option.value = languages[i].value;
      option.text = languages[i].text;
    }

    return container;
  },
});

function addLanguageControl() {
  if (!languageControl) {
    languageControl = new LanguageControl();
    mymap.addControl(languageControl);
  }
}

function removeLanguageControl() {
  if (languageControl) {
    mymap.removeControl(languageControl);
    languageControl = null;
  }
}

//=========================================================== DEMOGRAPHICS =================================================================

// Create a GeoJSON layer for demographic data
demographicGeoJson = L.geoJson(languageGeoJsonData, {
  filter: function (feature) {
    return feature.properties.boroname == BORO_NAME;
  },

  style: function (feature) {
    var style;
    style = {
      fillColor: getColorScaleForDemographics(feature.properties.Total_pop),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
    return style;
  },

  onEachFeature: function (feature, layer) {
    allFeatures(feature, layer);

    // Unique identifier to ensure each pie chart is rendered in the correct popup
    var p = feature.properties;
    var id = p.FID;
    var cdtanameClean = formatNeighborhoodName(p.cdtaname);

    // Create popup content with demographic details
    var popUpContent = `<h3>${p.Geographic}</h3><h5>(${cdtanameClean})</h5>`;

    if (p.Estimate == "no data") {
      popUpContent += `No data available for this Census Tract`;
    } else {
      // Text section
      popUpContent += `
        <p>Approximately <b>${parseInt(p.Total_pop).toLocaleString(
          "en-US"
        )}</b> people live in this census tract.</p>
        <p><b>${(p.Male_Pct * 100).toFixed(1)}%</b> (${
        p.Male
      }) of the population are male and <b>${(p.Female_Pct * 100).toFixed(
        1
      )}%</b> (${p.Female}) of the population are female</p>
        <p>The median age is <b>${p.Median_age}</b>.</p>`;

      // Pie chart section
      // Use JSON.stringify to turn the properties object into a string so it can be passed into updatePieChart function
      // Chart container must have a set size or responsive popup plugin will not work as intended
      popUpContent += `
      <button id="more-btn-${id}" onclick='showMoreButtons(${id})' style="background: none; border: none; color: blue; cursor: pointer; text-decoration: underline; padding: 0; margin-bottom: 4px">More</button>
      <button id="hide-btn-${id}" onclick='hideMoreButtons(${id})' style="background: none; border: none; color: blue; cursor: pointer; text-decoration: underline; padding: 0; display:none; margin-bottom: 4px">Hide</button>
      <div id="more-buttons-${id}" style="display:none;">
        <button onclick='updatePieChart(${id}, "gender", ${JSON.stringify(
        p
      )})' style="background: none; border: none; color: black; cursor: pointer; text-decoration: none; padding: 0; margin-right: 4px;" onmouseover="this.style.color='blue'" onmouseout="this.style.color='black'">Gender</button>
        <span style="color: black;">|</span>
        <button onclick='updatePieChart(${id}, "age", ${JSON.stringify(
        p
      )})' style="background: none; border: none; color: black; cursor: pointer; text-decoration: none; padding: 0; margin: 0 4px;" onmouseover="this.style.color='blue'" onmouseout="this.style.color='black'">Age</button>
        <span style="color: black;">|</span>
        <button onclick='updatePieChart(${id}, "hispanic", ${JSON.stringify(
        p
      )})' style="background: none; border: none; color: black; cursor: pointer; text-decoration: none; padding: 0; margin: 0 4px;" onmouseover="this.style.color='blue'" onmouseout="this.style.color='black'">Hispanic</button>
        <span style="color: black;">|</span>
        <button onclick='updateBarPlotForRace(${id}, ${JSON.stringify(
        p
      )})' style="background: none; border: none; color: black; cursor: pointer; text-decoration: none; padding: 0; margin-left: 4px;" onmouseover="this.style.color='blue'" onmouseout="this.style.color='black'">Race</button>
        <div id="chart-container-${id}" style="width: 150px; height: 200px; height: 100%;"></div>
      </div>
    `;
    }

    var popup = L.responsivePopup().setContent(popUpContent);
    layer.bindPopup(popup);

    // Event listener to create a pie chart when popup is opened
    layer.on("popupopen", function () {
      // Show gender pie chart by default
      updatePieChart(id, "gender", p);
    });
  },
});

// Function for demographic data to create a pie chart
function createPieChartForDemographic(id, data, extraData) {
  // Clear any existing element from the container
  d3.select(id).selectAll("*").remove();

  var width = 310,
    height = 200,
    radius = Math.min(width, height) / 2 - 25;

  var color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.label))
    .range(d3.schemeCategory10);

  var pie = d3.pie().value((d) => d.value);

  var arc = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr(
      "transform",
      "translate(" + (width / 2 - radius / 2) + "," + height / 2 + ")"
    );

  var g = svg
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip-donut")
    .style("opacity", 0);

  var tooltip = d3
    .select(id)
    .append("div")
    .attr("class", "tooltip")
    .style("border", "1px solid #000")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("display", "none");

  var formatter = new Intl.NumberFormat("en-US");

  g.append("path")
    .attr("d", arc)
    .style("fill", (d) => color(d.data.label))
    .attr("transform", "translate(0, 0)")
    // Hover effects
    .on("mouseover", function (event, d) {
      d3.select(this).transition().duration(50).attr("opacity", ".85");
      div.transition().duration(50).style("opacity", 1);
      var extraText = "";
      if (extraData[d.data.label]) {
        extraText = `<br> Under 5: ${formatter.format(
          extraData[d.data.label]
        )}`;
      }
      tooltip
        .style("display", "block")
        .html(`${d.data.label}: ${formatter.format(d.data.value)}${extraText}`);
    })
    .on("mouseout", function (event, d) {
      d3.select(this).transition().duration(50).attr("opacity", "1");
      div.transition().duration(50).style("opacity", 0);
      tooltip.style("display", "none");
    });

  // Pie chart legend
  var legend = svg
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      "translate(" + (radius + 20) + ",-" + (radius - 30) + ")"
    );

  var legendRect = 18;
  var legendSpacing = 4;

  var legendItem = legend
    .selectAll(".legend-item")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr(
      "transform",
      (d, i) => "translate(0," + i * (legendRect + legendSpacing) + ")"
    );

  legendItem
    .append("rect")
    .attr("width", legendRect)
    .attr("height", legendRect)
    .style("fill", color);

  legendItem
    .append("text")
    .attr("x", legendRect + legendSpacing)
    .attr("y", legendRect - legendSpacing)
    .text((d) => d);

  // Percentage labels
  g.append("text")
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("dy", "0.35em")
    .style("text-anchor", "middle")
    .text(function (d) {
      var percentage = (
        (d.data.value / d3.sum(data, (d) => d.value)) *
        100
      ).toFixed(1);
      return percentage + "%";
    });
}

// Create pie chart based on selected type (gender or age)
function updatePieChart(id, type, properties) {
  var pieData = [];
  var extraData = {};

  if (type === "gender") {
    pieData = [
      { label: "Male", value: properties.Male },
      { label: "Female", value: properties.Female },
    ];
  } else if (type === "age") {
    pieData = [
      { label: "Under 18", value: properties.Under_18 },
      { label: "18 and over", value: properties["18_plus"] },
      { label: "65 and over", value: properties["65_plus"] },
    ];
    extraData = { "Under 18": properties.Under_5 };
  } else if (type == "hispanic") {
    pieData = [
      { label: "Hispanic", value: properties.Hispanic },
      { label: "Non-Hispanic", value: properties.Not_Hispanic },
    ];
  }

  createPieChartForDemographic(`#chart-container-${id}`, pieData, extraData);
}

// Create bar plot base on race data
function createBarPlotForDemographics(id, data) {
  // Remove any existing barplot from the container
  d3.select(id).selectAll("*").remove();

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 100, left: 30 },
    width = 325 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Calculate total sum
  var total = d3.sum(data, function (d) {
    return d.value;
  });

  // Convert each value to percentage
  data.forEach(function (d) {
    d.percentage = (d.value / total) * 100;
  });

  // sort data by percentage
  data.sort(function (b, a) {
    return a.percentage - b.percentage;
  });

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map(function (d) {
        return d.label;
      })
    )
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Find the maximum percentage value
  var maxPercentage = d3.max(data, function (d) {
    return d.percentage;
  });

  // Y axis percentage
  var y = d3.scaleLinear().domain([0, maxPercentage]).range([height, 0]);
  svg.append("g").call(
    d3.axisLeft(y).tickFormat(function (d) {
      return d + "%";
    })
  );

  // Bars
  var bars = svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.label);
    })
    .attr("y", function (d) {
      return y(d.percentage);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.percentage);
    })
    .attr("fill", "#69b3a2");

  // Tooltip
  var tooltip = d3
    .select(id)
    .append("div")
    .attr("class", "tooltip")
    .style("border", "1px solid #000")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("display", "none");

  var formatter = new Intl.NumberFormat("en-US");

  // Bar hover effects
  bars
    .on("mouseover", function (event, d) {
      d3.select(this).transition().duration(50).attr("opacity", ".7");

      // Change label name for abbreviations
      var label = d.label;
      if (label === "AIAN") {
        label = "American Indians and Alaska Natives";
      } else if (label === "NHOPI") {
        label = "Native Hawaiian or Other Pacific Islander";
      }

      tooltip
        .style("display", "block")
        .html(
          `${label}: ${formatter.format(
            d.value
          )}<br>Percentage: ${d.percentage.toFixed(2)}%`
        );
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 25 + "px");
    })
    .on("mouseout", function (event, d) {
      d3.select(this).transition().duration(50).attr("opacity", "1");

      tooltip.style("display", "none");
    });
}

// Update bar plot value base on race data
function updateBarPlotForRace(id, properties) {
  var barData = [
    { label: "White", value: parseInt(properties.White) },
    { label: "Black", value: parseInt(properties.Black) },
    {
      label: "AIAN",
      value: parseInt(properties.AIAN),
    },
    { label: "Asian", value: parseInt(properties.Asian) },
    {
      label: "NHOPI",
      value: parseInt(properties.NHOPI),
    },
  ];

  createBarPlotForDemographics(`#chart-container-${id}`, barData);
}

function showMoreButtons(id) {
  document.getElementById(`more-buttons-${id}`).style.display = "block";
  document.getElementById(`more-btn-${id}`).style.display = "none";
  document.getElementById(`hide-btn-${id}`).style.display = "block";
}

function hideMoreButtons(id) {
  document.getElementById(`more-buttons-${id}`).style.display = "none";
  document.getElementById(`more-btn-${id}`).style.display = "block";
  document.getElementById(`hide-btn-${id}`).style.display = "none";
}

// Function to update the legend based on the selected layer and language
function updateLegend(selectedLayer, selectedLanguage) {
  var legendContent = "";

  if (selectedLayer == "language") {
    if (selectedLanguage == "") {
      legendContent += "<h4>Predominant Languages</h4>";
      legendContent +=
        '<i style="background: #51eba6ff"></i><span>Arabic</span><br>';
      legendContent +=
        '<i style="background: #963f92ff"></i><span>Chinese</span><br>';
      legendContent +=
        '<i style="background: #30bfc7ff"></i><span>French, Haitian Creole, or Cajun</span><br>';
      legendContent +=
        '<i style="background: #3288bd"></i><span>German or other West Germanic languages</span><br>';
      legendContent +=
        '<i style="background: #e7298a"></i><span>Korean</span><br>';
      legendContent +=
        '<i style="background: #f0d36e"></i><span>Other and unspecified languages</span><br>';
      legendContent +=
        '<i style="background: #795cb8"></i><span>Other Asian and Pacific Island languages</span><br>';
      legendContent +=
        '<i style="background: #507587"></i><span>Other Indo-European languages</span><br>';
      legendContent +=
        '<i style="background: #e28513ff"></i><span>Russian, Polish, or other Slavic languages</span><br>';
      legendContent +=
        '<i style="background: #41ab5d"></i><span>Spanish</span><br>';
      legendContent +=
        '<i style="background: #eb554dff"></i><span>Tagalog (incl. Filipino)</span><br>';
      legendContent +=
        '<i style="background: #c7e9b4"></i><span>Vietnamese</span><br>';
    } else {
      legendContent += `<h4>${selectedLanguage} Speakers</h4>`;
      switch (selectedLanguage) {
        case "Arabic":
          legendContent += `<i style="background: #00441b"></i><span>> ${arabicBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            arabicBreaks[5] + 1
          } - ${arabicBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            arabicBreaks[4] + 1
          } - ${arabicBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            arabicBreaks[3] + 1
          } - ${arabicBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            arabicBreaks[2] + 1
          } - ${arabicBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            arabicBreaks[1] + 1
          } - ${arabicBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${arabicBreaks[0]} - ${arabicBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Chinese":
          legendContent += `<i style="background: #00441b"></i><span>> ${chineseBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            chineseBreaks[5] + 1
          } - ${chineseBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            chineseBreaks[4] + 1
          } - ${chineseBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            chineseBreaks[3] + 1
          } - ${chineseBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            chineseBreaks[2] + 1
          } - ${chineseBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            chineseBreaks[1] + 1
          } - ${chineseBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${chineseBreaks[0]} - ${chineseBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "French, Haitian Creole, or Cajun":
          legendContent += `<i style="background: #00441b"></i><span>> ${frenchBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            frenchBreaks[5] + 1
          } - ${frenchBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            frenchBreaks[4] + 1
          } - ${frenchBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            frenchBreaks[3] + 1
          } - ${frenchBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            frenchBreaks[2] + 1
          } - ${frenchBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            frenchBreaks[1] + 1
          } - ${frenchBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${frenchBreaks[0]} - ${frenchBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "German or other West Germanic languages":
          legendContent += `<i style="background: #00441b"></i><span>> ${germanBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            germanBreaks[5] + 1
          } - ${germanBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            germanBreaks[4] + 1
          } - ${germanBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            germanBreaks[3] + 1
          } - ${germanBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            germanBreaks[2] + 1
          } - ${germanBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            germanBreaks[1] + 1
          } - ${germanBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${germanBreaks[0]} - ${germanBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Korean":
          legendContent += `<i style="background: #00441b"></i><span>> ${koreanBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            koreanBreaks[5] + 1
          } - ${koreanBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            koreanBreaks[4] + 1
          } - ${koreanBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            koreanBreaks[3] + 1
          } - ${koreanBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            koreanBreaks[2] + 1
          } - ${koreanBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            koreanBreaks[1] + 1
          } - ${koreanBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${koreanBreaks[0]} - ${koreanBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Other and unspecified languages":
          legendContent += `<i style="background: #00441b"></i><span>> ${otherBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            otherBreaks[5] + 1
          } - ${otherBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            otherBreaks[4] + 1
          } - ${otherBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            otherBreaks[3] + 1
          } - ${otherBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            otherBreaks[2] + 1
          } - ${otherBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            otherBreaks[1] + 1
          } - ${otherBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${otherBreaks[0]} - ${otherBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Other Asian and Pacific Island languages":
          legendContent += `<i style="background: #00441b"></i><span>> ${otherAsiaBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            otherAsiaBreaks[5] + 1
          } - ${otherAsiaBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            otherAsiaBreaks[4] + 1
          } - ${otherAsiaBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            otherAsiaBreaks[3] + 1
          } - ${otherAsiaBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            otherAsiaBreaks[2] + 1
          } - ${otherAsiaBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            otherAsiaBreaks[1] + 1
          } - ${otherAsiaBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${otherAsiaBreaks[0]} - ${otherAsiaBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Other Indo-European languages":
          legendContent += `<i style="background: #00441b"></i><span>> ${otherIndoBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            otherIndoBreaks[5] + 1
          } - ${otherIndoBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            otherIndoBreaks[4] + 1
          } - ${otherIndoBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            otherIndoBreaks[3] + 1
          } - ${otherIndoBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            otherIndoBreaks[2] + 1
          } - ${otherIndoBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            otherIndoBreaks[1] + 1
          } - ${otherIndoBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${otherIndoBreaks[0]} - ${otherIndoBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Russian, Polish, or other Slavic languages":
          legendContent += `<i style="background: #00441b"></i><span>> ${russianBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            russianBreaks[5] + 1
          } - ${russianBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            russianBreaks[4] + 1
          } - ${russianBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            russianBreaks[3] + 1
          } - ${russianBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            russianBreaks[2] + 1
          } - ${russianBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            russianBreaks[1] + 1
          } - ${russianBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${russianBreaks[0]} - ${russianBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Spanish":
          legendContent += `<i style="background: #00441b"></i><span>> ${spanishBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            spanishBreaks[5] + 1
          } - ${spanishBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            spanishBreaks[4] + 1
          } - ${spanishBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            spanishBreaks[3] + 1
          } - ${spanishBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            spanishBreaks[2] + 1
          } - ${spanishBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            spanishBreaks[1] + 1
          } - ${spanishBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${spanishBreaks[0]} - ${spanishBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Tagalog (incl. Filipino)":
          legendContent += `<i style="background: #00441b"></i><span>> ${tagalogBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            tagalogBreaks[5] + 1
          } - ${tagalogBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            tagalogBreaks[4] + 1
          } - ${tagalogBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            tagalogBreaks[3] + 1
          } - ${tagalogBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            tagalogBreaks[2] + 1
          } - ${tagalogBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            tagalogBreaks[1] + 1
          } - ${tagalogBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${tagalogBreaks[0]} - ${tagalogBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
        case "Vietnamese":
          legendContent += `<i style="background: #00441b"></i><span>> ${vietnameseBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #006d2c"></i><span>${
            vietnameseBreaks[5] + 1
          } - ${vietnameseBreaks[6]}</span><br>`;
          legendContent += `<i style="background: #238b45"></i><span>${
            vietnameseBreaks[4] + 1
          } - ${vietnameseBreaks[5]}</span><br>`;
          legendContent += `<i style="background: #41ae76"></i><span>${
            vietnameseBreaks[3] + 1
          } - ${vietnameseBreaks[4]}</span><br>`;
          legendContent += `<i style="background: #66c2a4"></i><span>${
            vietnameseBreaks[2] + 1
          } - ${vietnameseBreaks[3]}</span><br>`;
          legendContent += `<i style="background: #99d8c9"></i><span>${
            vietnameseBreaks[1] + 1
          } - ${vietnameseBreaks[2]}</span><br>`;
          legendContent += `<i style="background: #ccece6"></i><span>${vietnameseBreaks[0]} - ${vietnameseBreaks[1]}</span><br>`;
          legendContent +=
            '<i style="background: #606060"></i><span>No Data</span><br>';
          break;
      }
    }
  } else if ((selectedLayer = "demographics")) {
    legendContent += "<h4>Population Density</h4>";
    legendContent += `<i style="background: #00441b"></i><span>> ${totalPopBreaks[6]}</span><br>`;
    legendContent += `<i style="background: #006d2c"></i><span>${
      totalPopBreaks[5] + 1
    } - ${totalPopBreaks[6]}</span><br>`;
    legendContent += `<i style="background: #238b45"></i><span>${
      totalPopBreaks[4] + 1
    } - ${totalPopBreaks[5]}</span><br>`;
    legendContent += `<i style="background: #41ae76"></i><span>${
      totalPopBreaks[3] + 1
    } - ${totalPopBreaks[4]}</span><br>`;
    legendContent += `<i style="background: #66c2a4"></i><span>${
      totalPopBreaks[2] + 1
    } - ${totalPopBreaks[3]}</span><br>`;
    legendContent += `<i style="background: #99d8c9"></i><span>${
      totalPopBreaks[1] + 1
    } - ${totalPopBreaks[2]}</span><br>`;
    legendContent += `<i style="background: #ccece6"></i><span>${totalPopBreaks[0]} - ${totalPopBreaks[1]}</span><br>`;
    legendContent +=
      '<i style="background: #606060"></i><span>No Data</span><br>';
  }

  document.querySelector(".legend").innerHTML = legendContent;
}

// Event listener for baselayer change to update the legend
mymap.on("baselayerchange", function (e) {
  if (e.name === "Language Data") {
    selectedLayer = "language";
    selectedLanguage = "";
    addLanguageControl();
    updateLegend(
      selectedLayer,
      document.getElementById("languageSelect").value
    );
    updateMap();
  } else if (e.name === "Demographic Data") {
    selectedLayer = "demographics";
    removeLanguageControl();
    updateLegend(selectedLayer, "");
  }
  bringZipLayersToFront();
});

updateLegend(selectedLayer, "");

//=========================================================== LAYERS CONTROL =================================================================

var baseLayers = {
  "Language Data": languageGroup,
  "Demographic Data": demographicGeoJson,
};

L.control.layers(baseLayers, boundaries, { collapsed: false }).addTo(mymap);

addLanguageControl();

updateMap();

//=========================================================== Health Risk Behaviors Map =================================================================

maps["healthRiskBehaviorsMap"] = L.map("healthRiskBehaviorsMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11.5,
  zoomSnap: ZOOM_INCREMENT,
  zoomDelta: ZOOM_INCREMENT,
}).setView([40.65, -73.97], INITIAL_ZOOM_LEVEL);

var baseLayer = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2hlZW5hcCIsImEiOiJja25hdXE3aGcxbGI4MnVxbnFoenhwdGRrIn0.DhFwD-KlRigYLaVwL8ipGA",
  }
).addTo(maps["healthRiskBehaviorsMap"]);

var healthRiskLayers = {};
Object.values(healthRiskLayerNames).forEach((layerName) => {
  healthRiskLayers[layerName] = L.geoJson(null, {
    style: healthRiskStyle(layerName, getColorHealthRisk(layerName)),
  });
});

function healthRiskStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

function getColorHealthRisk(layerName) {
  switch (layerName) {
    case healthRiskLayerNames.UNINSURED:
      return getColorForUninsured;
    case healthRiskLayerNames.FREQUENT_DRINKERS:
      return getColorForFrequentDrinkers;
    case healthRiskLayerNames.CURRENT_SMOKERS:
      return getColorForCurrentSmokers;
    case healthRiskLayerNames.SEDENTARY_LIFESTYLE:
      return getColorForSedentaryLifestyle;
    case healthRiskLayerNames.SLEEP_LESS_THAN_7_HOURS:
      return getColorForSleepLessThan7Hours;
    default:
      return () => "#606060";
  }
}

function addHealthRiskData(data) {
  data.features.forEach(function (feature) {
    if (feature.properties["County name"] != COUNTY_NAME) {
      return;
    }

    var p = feature.properties;

    var uninsuredPopup = `
      <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
      Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated lack of health insurance crude prevalence is 
      <b>${p["Lack of health insurance crude prevalence (%)"]}%</b>
      ${p["Lack of health insurance crude prevalence 95% CI"]}.
    `;

    var frequentDrinkersPopup = `
      <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
      Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated binge drinking crude prevalence is 
      <b>${p["Binge drinking crude prevalence (%)"]}%</b> 
      ${p["Binge drinking crude prevalence 95% CI"]}.
    `;

    var currentSmokersPopup = `
      <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
      Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated current smoking crude prevalence is 
      <b>${p["Current smoking crude prevalence (%)"]}%</b> 
      ${p["Current smoking crude prevalence 95% CI"]}.
    `;

    var sedentaryLifestylePopup = `
      <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
      Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated physical inactivity crude prevalence is 
      <b>${p["Physical inactivity crude prevalence (%)"]}%</b> 
      ${p["Physical inactivity crude prevalence 95% CI"]}.
    `;

    var sleepLessThan7HoursPopup = `
      <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
      Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated prevalence of sleep less than 7 hours is 
      <b>${p["Sleep <7 hours crude prevalence (%)"]}%</b> 
      ${p["Sleep <7 hours crude prevalence 95% CI"]}.
    `;

    var uninsuredLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Lack of health insurance crude prevalence (%)",
        getColorForUninsured
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(uninsuredPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers[healthRiskLayerNames.UNINSURED].addLayer(uninsuredLayer);

    var frequentDrinkersLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Binge drinking crude prevalence (%)",
        getColorForFrequentDrinkers
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(frequentDrinkersPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers[healthRiskLayerNames.FREQUENT_DRINKERS].addLayer(
      frequentDrinkersLayer
    );

    var currentSmokersLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Current smoking crude prevalence (%)",
        getColorForCurrentSmokers
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(currentSmokersPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers[healthRiskLayerNames.CURRENT_SMOKERS].addLayer(
      currentSmokersLayer
    );

    var sedentaryLifestyleLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Physical inactivity crude prevalence (%)",
        getColorForSedentaryLifestyle
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(sedentaryLifestylePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers[healthRiskLayerNames.SEDENTARY_LIFESTYLE].addLayer(
      sedentaryLifestyleLayer
    );

    var sleepLessThan7HoursLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Sleep <7 hours crude prevalence (%)",
        getColorForSleepLessThan7Hours
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(sleepLessThan7HoursPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthRiskLayers[healthRiskLayerNames.SLEEP_LESS_THAN_7_HOURS].addLayer(
      sleepLessThan7HoursLayer
    );
  });
}

addHealthRiskData(healthDataGeojson);

var healthRiskBaseLayers = {
  [healthRiskLayerNames.UNINSURED]:
    healthRiskLayers[healthRiskLayerNames.UNINSURED],
  [healthRiskLayerNames.FREQUENT_DRINKERS]:
    healthRiskLayers[healthRiskLayerNames.FREQUENT_DRINKERS],
  [healthRiskLayerNames.CURRENT_SMOKERS]:
    healthRiskLayers[healthRiskLayerNames.CURRENT_SMOKERS],
  [healthRiskLayerNames.SEDENTARY_LIFESTYLE]:
    healthRiskLayers[healthRiskLayerNames.SEDENTARY_LIFESTYLE],
  [healthRiskLayerNames.SLEEP_LESS_THAN_7_HOURS]:
    healthRiskLayers[healthRiskLayerNames.SLEEP_LESS_THAN_7_HOURS],
};
L.control
  .layers(healthRiskBaseLayers, boundaries, { collapsed: false })
  .addTo(maps["healthRiskBehaviorsMap"]);

// HEALTH RISK LEGEND CONTROL
var healthRisklegend = L.control({ position: "bottomleft" });

healthRisklegend.onAdd = function () {
  var div = L.DomUtil.create("div", "healthRiskLegend");
  div.innerHTML = `
  <h4>${healthRiskLayerNames.UNINSURED}</h4>
  <i style="background: ${
    healthRiskColors[0]
  }"></i><span> > ${lackOfHealthInsuranceBreaks[6].toFixed(1)}%</span><br>
  <i style="background: ${healthRiskColors[1]}"></i><span>${(
    lackOfHealthInsuranceBreaks[5] + 0.1
  ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[6].toFixed(1)}%</span><br>
  <i style="background: ${healthRiskColors[2]}"></i><span>${(
    lackOfHealthInsuranceBreaks[4] + 0.1
  ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[5].toFixed(1)}%</span><br>
  <i style="background: ${healthRiskColors[3]}"></i><span>${(
    lackOfHealthInsuranceBreaks[3] + 0.1
  ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[4].toFixed(1)}%</span><br>
  <i style="background: ${healthRiskColors[4]}"></i><span>${(
    lackOfHealthInsuranceBreaks[2] + 0.1
  ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[3].toFixed(1)}%</span><br>
  <i style="background: ${healthRiskColors[5]}"></i><span>${(
    lackOfHealthInsuranceBreaks[1] + 0.1
  ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[2].toFixed(1)}%</span><br>
  <i style="background: ${healthRiskColors[6]}"></i><span>${(
    lackOfHealthInsuranceBreaks[0] + 0.1
  ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[1].toFixed(1)}%</span><br>
  <i style="background: ${
    healthRiskColors[7]
  }"></i><span>0% - ${lackOfHealthInsuranceBreaks[0].toFixed(1)}%</span><br>
  <i style="background: ${healthRiskColors[8]}"></i><span>No Data</span><br>
`;
  return div;
};

healthRisklegend.addTo(maps["healthRiskBehaviorsMap"]);

function updateLegendForHealthRisk(layerName) {
  var legendContent = "";
  switch (layerName) {
    case healthRiskLayerNames.UNINSURED:
      legendContent = `
          <h4>${healthRiskLayerNames.UNINSURED}</h4>
          <i style="background: ${
            healthRiskColors[0]
          }"></i><span> > ${lackOfHealthInsuranceBreaks[6].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthRiskColors[1]}"></i><span>${(
        lackOfHealthInsuranceBreaks[5] + 0.1
      ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[2]}"></i><span>${(
        lackOfHealthInsuranceBreaks[4] + 0.1
      ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[3]}"></i><span>${(
        lackOfHealthInsuranceBreaks[3] + 0.1
      ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[4]}"></i><span>${(
        lackOfHealthInsuranceBreaks[2] + 0.1
      ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[5]}"></i><span>${(
        lackOfHealthInsuranceBreaks[1] + 0.1
      ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[6]}"></i><span>${(
        lackOfHealthInsuranceBreaks[0] + 0.1
      ).toFixed(1)}% - ${lackOfHealthInsuranceBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthRiskColors[7]
          }"></i><span>0% - ${lackOfHealthInsuranceBreaks[0].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthRiskColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthRiskLayerNames.FREQUENT_DRINKERS:
      legendContent = `
          <h4>${healthRiskLayerNames.FREQUENT_DRINKERS}</h4>
          <i style="background: ${
            healthRiskColors[0]
          }"></i><span> > ${bingeDrinkingBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[1]}"></i><span>${(
        bingeDrinkingBreaks[5] + 0.1
      ).toFixed(1)}% - ${bingeDrinkingBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[2]}"></i><span>${(
        bingeDrinkingBreaks[4] + 0.1
      ).toFixed(1)}% - ${bingeDrinkingBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[3]}"></i><span>${(
        bingeDrinkingBreaks[3] + 0.1
      ).toFixed(1)}% - ${bingeDrinkingBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[4]}"></i><span>${(
        bingeDrinkingBreaks[2] + 0.1
      ).toFixed(1)}% - ${bingeDrinkingBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[5]}"></i><span>${(
        bingeDrinkingBreaks[1] + 0.1
      ).toFixed(1)}% - ${bingeDrinkingBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[6]}"></i><span>${(
        bingeDrinkingBreaks[0] + 0.1
      ).toFixed(1)}% - ${bingeDrinkingBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthRiskColors[7]
          }"></i><span>0% - ${bingeDrinkingBreaks[0].toFixed(1)}%</span><br>
          <i style="background: ${
            healthRiskColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthRiskLayerNames.CURRENT_SMOKERS:
      legendContent = `
          <h4>${healthRiskLayerNames.CURRENT_SMOKERS}</h4>
          <i style="background: ${
            healthRiskColors[0]
          }"></i><span> > ${currentSmokingBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[1]}"></i><span>${(
        currentSmokingBreaks[5] + 0.1
      ).toFixed(1)}% - ${currentSmokingBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[2]}"></i><span>${(
        currentSmokingBreaks[4] + 0.1
      ).toFixed(1)}% - ${currentSmokingBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[3]}"></i><span>${(
        currentSmokingBreaks[3] + 0.1
      ).toFixed(1)}% - ${currentSmokingBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[4]}"></i><span>${(
        currentSmokingBreaks[2] + 0.1
      ).toFixed(1)}% - ${currentSmokingBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[5]}"></i><span>${(
        currentSmokingBreaks[1] + 0.1
      ).toFixed(1)}% - ${currentSmokingBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[6]}"></i><span>${(
        currentSmokingBreaks[0] + 0.1
      ).toFixed(1)}% - ${currentSmokingBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthRiskColors[7]
          }"></i><span>0% - ${currentSmokingBreaks[0].toFixed(1)}%</span><br>
          <i style="background: ${
            healthRiskColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthRiskLayerNames.SEDENTARY_LIFESTYLE:
      legendContent = `
          <h4>${healthRiskLayerNames.SEDENTARY_LIFESTYLE}</h4>
          <i style="background: ${
            healthRiskColors[0]
          }"></i><span> > ${physicalInactivityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[1]}"></i><span>${(
        physicalInactivityBreaks[5] + 0.1
      ).toFixed(1)}% - ${physicalInactivityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[2]}"></i><span>${(
        physicalInactivityBreaks[4] + 0.1
      ).toFixed(1)}% - ${physicalInactivityBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[3]}"></i><span>${(
        physicalInactivityBreaks[3] + 0.1
      ).toFixed(1)}% - ${physicalInactivityBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[4]}"></i><span>${(
        physicalInactivityBreaks[2] + 0.1
      ).toFixed(1)}% - ${physicalInactivityBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[5]}"></i><span>${(
        physicalInactivityBreaks[1] + 0.1
      ).toFixed(1)}% - ${physicalInactivityBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[6]}"></i><span>${(
        physicalInactivityBreaks[0] + 0.1
      ).toFixed(1)}% - ${physicalInactivityBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthRiskColors[7]
          }"></i><span>0% - ${physicalInactivityBreaks[0].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthRiskColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthRiskLayerNames.SLEEP_LESS_THAN_7_HOURS:
      legendContent = `
          <h4>${healthRiskLayerNames.SLEEP_LESS_THAN_7_HOURS}</h4>
          <i style="background: ${
            healthRiskColors[0]
          }"></i><span> > ${sleepLessThan7HoursBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[1]}"></i><span>${(
        sleepLessThan7HoursBreaks[5] + 0.1
      ).toFixed(1)}% - ${sleepLessThan7HoursBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[2]}"></i><span>${(
        sleepLessThan7HoursBreaks[4] + 0.1
      ).toFixed(1)}% - ${sleepLessThan7HoursBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[3]}"></i><span>${(
        sleepLessThan7HoursBreaks[3] + 0.1
      ).toFixed(1)}% - ${sleepLessThan7HoursBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[4]}"></i><span>${(
        sleepLessThan7HoursBreaks[2] + 0.1
      ).toFixed(1)}% - ${sleepLessThan7HoursBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[5]}"></i><span>${(
        sleepLessThan7HoursBreaks[1] + 0.1
      ).toFixed(1)}% - ${sleepLessThan7HoursBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthRiskColors[6]}"></i><span>${(
        sleepLessThan7HoursBreaks[0] + 0.1
      ).toFixed(1)}% - ${sleepLessThan7HoursBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthRiskColors[7]
          }"></i><span>0% - ${sleepLessThan7HoursBreaks[0].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthRiskColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
  }
  document.querySelector(".healthRiskLegend").innerHTML = legendContent;
  bringZipLayersToFront();
}

maps["healthRiskBehaviorsMap"].on("baselayerchange", function (e) {
  updateLegendForHealthRisk(e.name);
});

// Set uninsured layer as the default
updateLegendForHealthRisk(healthRiskLayerNames.UNINSURED);
healthRiskLayers[healthRiskLayerNames.UNINSURED].addTo(
  maps["healthRiskBehaviorsMap"]
);

//=========================================================== Health Outcomes Map =================================================================

maps["healthOutcomesMap"] = L.map("healthOutcomesMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11.5,
  zoomSnap: ZOOM_INCREMENT,
  zoomDelta: ZOOM_INCREMENT,
}).setView([40.65, -73.97], INITIAL_ZOOM_LEVEL);

var baseLayer3 = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2hlZW5hcCIsImEiOiJja25hdXE3aGcxbGI4MnVxbnFoenhwdGRrIn0.DhFwD-KlRigYLaVwL8ipGA",
  }
).addTo(maps["healthOutcomesMap"]);

var healthOutcomesLayers = {};
Object.values(healthOutcomesLayerNames).forEach((layerName) => {
  healthOutcomesLayers[layerName] = L.geoJson(null, {
    style: healthOutcomesStyle(layerName, getColorHealthOutcome(layerName)),
  });
});

function healthOutcomesStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

function getColorHealthOutcome(layerName) {
  switch (layerName) {
    case healthOutcomesLayerNames.ASTHMA_PREVALENCE:
      return getColorForCurrentAsthma;
    case healthOutcomesLayerNames.HIGH_BLOOD_PRESSURE:
      return getColorForHighBlood;
    case healthOutcomesLayerNames.CANCER_PREVALENCE:
      return getColorForCancerAdults;
    case healthOutcomesLayerNames.HIGH_CHOLESTEROL:
      return getColorForHighCholesterol;
    case healthOutcomesLayerNames.CHRONIC_KIDNEY_DISEASE:
      return getColorForKidneyDisease;
    case healthOutcomesLayerNames.PULMONARY_DISEASE:
      return getColorForPulmonaryDisease;
    case healthOutcomesLayerNames.HEART_DISEASE:
      return getColorForHeartDisease;
    case healthOutcomesLayerNames.DIABETES_PREVALENCE:
      return getColorForDiabetes;
    case healthOutcomesLayerNames.OBESITY_PREVALENCE:
      return getColorForObesity;
    case healthOutcomesLayerNames.STROKE_PREVALENCE:
      return getColorForStroke;
    default:
      return () => "#606060";
  }
}

function addHealthOutcomesData(data) {
  data.features.forEach(function (feature) {
    if (feature.properties["County name"] != COUNTY_NAME) {
      return;
    }

    var p = feature.properties;

    var currentAsthmaPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated current asthma crude prevalence is 
    <b>${p["Current asthma crude prevalence (%)"]}%</b> 
    ${p["Current asthma crude prevalence 95% CI"]}.
  `;

    var highBloodPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated high blood pressure crude prevalence is 
    <b>${p["High blood pressure crude prevalence (%)"]}%</b> 
    ${p["High blood pressure crude prevalence 95% CI"]}.
  `;

    var cancerAdultsPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated cancer (except skin) crude prevalence is 
    <b>${p["Cancer (except skin) crude prevalence (%)"]}%</b> 
    ${p["Cancer (except skin) crude prevalence 95% CI"]}.
  `;

    var highCholesterolPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated high cholesterol crude prevalence is 
    <b>${p["High cholesterol crude prevalence (%)"]}%</b> 
    ${p["High cholesterol crude prevalence 95% CI"]}.
  `;

    var kidneyDiseasePopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated chronic kidney disease crude prevalence is 
    <b>${p["Chronic kidney disease crude prevalence (%)"]}%</b> 
    ${p["Chronic kidney disease crude prevalence 95% CI"]}.
  `;

    var pulmonaryDiseasePopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated pulmonary disease crude prevalence is 
    <b>${p["Arthritis crude prevalence (%)"]}%</b> 
    ${p["Arthritis crude prevalence 95% CI"]}.
  `;

    var heartDiseasePopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated heart disease crude prevalence is 
    <b>${p["Coronary heart disease crude prevalence (%)"]}%</b> 
    ${p["Coronary heart disease crude prevalence 95% CI"]}.
  `;

    var diabetesPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated diabetes crude prevalence is 
    <b>${p["Diabetes crude prevalence (%)"]}%</b> 
    ${p["Diabetes crude prevalence 95% CI"]}.
  `;

    var obesityPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated obesity crude prevalence is 
    <b>${p["Obesity crude prevalence (%)"]}%</b> 
    ${p["Obesity crude prevalence 95% CI"]}.
  `;

    var strokePopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated stroke crude prevalence is 
    <b>${p["Stroke crude prevalence (%)"]}%</b> 
    ${p["Stroke crude prevalence 95% CI"]}.
  `;

    var currentAsthmaLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Current asthma crude prevalence (%)",
        getColorForCurrentAsthma
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(currentAsthmaPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[healthOutcomesLayerNames.ASTHMA_PREVALENCE].addLayer(
      currentAsthmaLayer
    );

    var highBloodLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "High blood pressure crude prevalence (%)",
        getColorForHighBlood
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(highBloodPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[healthOutcomesLayerNames.HIGH_BLOOD_PRESSURE].addLayer(
      highBloodLayer
    );

    var cancerAdultsLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Cancer (except skin) crude prevalence (%)",
        getColorForCancerAdults
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(cancerAdultsPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[healthOutcomesLayerNames.CANCER_PREVALENCE].addLayer(
      cancerAdultsLayer
    );

    var highCholesterolLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "High cholesterol crude prevalence (%)",
        getColorForHighCholesterol
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(highCholesterolPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[healthOutcomesLayerNames.HIGH_CHOLESTEROL].addLayer(
      highCholesterolLayer
    );

    var kidneyDiseaseLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Chronic kidney disease crude prevalence (%)",
        getColorForKidneyDisease
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(kidneyDiseasePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[
      healthOutcomesLayerNames.CHRONIC_KIDNEY_DISEASE
    ].addLayer(kidneyDiseaseLayer);

    var pulmonaryDiseaseLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Arthritis crude prevalence (%)",
        getColorForPulmonaryDisease
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(pulmonaryDiseasePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[healthOutcomesLayerNames.PULMONARY_DISEASE].addLayer(
      pulmonaryDiseaseLayer
    );

    var heartDiseaseLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Coronary heart disease crude prevalence (%)",
        getColorForHeartDisease
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(heartDiseasePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[healthOutcomesLayerNames.HEART_DISEASE].addLayer(
      heartDiseaseLayer
    );

    var diabetesLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Diabetes crude prevalence (%)",
        getColorForDiabetes
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(diabetesPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[healthOutcomesLayerNames.DIABETES_PREVALENCE].addLayer(
      diabetesLayer
    );

    var obesityLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Obesity crude prevalence (%)",
        getColorForObesity
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(obesityPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[healthOutcomesLayerNames.OBESITY_PREVALENCE].addLayer(
      obesityLayer
    );

    var strokeLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Stroke crude prevalence (%)",
        getColorForStroke
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(strokePopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthOutcomesLayers[healthOutcomesLayerNames.STROKE_PREVALENCE].addLayer(
      strokeLayer
    );
  });
}

addHealthOutcomesData(healthDataGeojson);

var healthOutcomesBaseLayers = {
  [healthOutcomesLayerNames.ASTHMA_PREVALENCE]:
    healthOutcomesLayers[healthOutcomesLayerNames.ASTHMA_PREVALENCE],
  [healthOutcomesLayerNames.HIGH_BLOOD_PRESSURE]:
    healthOutcomesLayers[healthOutcomesLayerNames.HIGH_BLOOD_PRESSURE],
  [healthOutcomesLayerNames.CANCER_PREVALENCE]:
    healthOutcomesLayers[healthOutcomesLayerNames.CANCER_PREVALENCE],
  [healthOutcomesLayerNames.HIGH_CHOLESTEROL]:
    healthOutcomesLayers[healthOutcomesLayerNames.HIGH_CHOLESTEROL],
  [healthOutcomesLayerNames.CHRONIC_KIDNEY_DISEASE]:
    healthOutcomesLayers[healthOutcomesLayerNames.CHRONIC_KIDNEY_DISEASE],
  [healthOutcomesLayerNames.PULMONARY_DISEASE]:
    healthOutcomesLayers[healthOutcomesLayerNames.PULMONARY_DISEASE],
  [healthOutcomesLayerNames.HEART_DISEASE]:
    healthOutcomesLayers[healthOutcomesLayerNames.HEART_DISEASE],
  [healthOutcomesLayerNames.DIABETES_PREVALENCE]:
    healthOutcomesLayers[healthOutcomesLayerNames.DIABETES_PREVALENCE],
  [healthOutcomesLayerNames.OBESITY_PREVALENCE]:
    healthOutcomesLayers[healthOutcomesLayerNames.OBESITY_PREVALENCE],
  [healthOutcomesLayerNames.STROKE_PREVALENCE]:
    healthOutcomesLayers[healthOutcomesLayerNames.STROKE_PREVALENCE],
};

L.control
  .layers(healthOutcomesBaseLayers, boundaries, { collapsed: false })
  .addTo(maps["healthOutcomesMap"]);

// HEALTH OUTCOMES LEGEND CONTROL
var healthOutcomesLegend = L.control({ position: "bottomleft" });

healthOutcomesLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "healthOutcomesLegend");
  div.innerHTML = `
  <h4>${healthOutcomesLayerNames.ASTHMA_PREVALENCE}</h4>
  <i style="background: ${
    healthOutcomesColors[0]
  }"></i><span>> ${currentAsthmaBreaks[6].toFixed(1)}%</span><br>
  <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
    currentAsthmaBreaks[5] + 0.1
  ).toFixed(1)}% - ${currentAsthmaBreaks[6].toFixed(1)}%</span><br>
  <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
    currentAsthmaBreaks[4] + 0.1
  ).toFixed(1)}% - ${currentAsthmaBreaks[5].toFixed(1)}%</span><br>
  <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
    currentAsthmaBreaks[3] + 0.1
  ).toFixed(1)}% - ${currentAsthmaBreaks[4].toFixed(1)}%</span><br>
  <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
    currentAsthmaBreaks[2] + 0.1
  ).toFixed(1)}% - ${currentAsthmaBreaks[3].toFixed(1)}%</span><br>
  <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
    currentAsthmaBreaks[1] + 0.1
  ).toFixed(1)}% - ${currentAsthmaBreaks[2].toFixed(1)}%</span><br>
  <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
    currentAsthmaBreaks[0] + 0.1
  ).toFixed(1)}% - ${currentAsthmaBreaks[1].toFixed(1)}%</span><br>
  <i style="background: ${
    healthOutcomesColors[7]
  }"></i><span>0% - ${currentAsthmaBreaks[0].toFixed(1)}%</span><br>
  <i style="background: ${healthOutcomesColors[8]}"></i><span>No Data</span><br>
`;
  return div;
};

healthOutcomesLegend.addTo(maps["healthOutcomesMap"]);

function updateLegendForHealthOutcomes(layerName) {
  var legendContent = "";
  switch (layerName) {
    case healthOutcomesLayerNames.ASTHMA_PREVALENCE:
      legendContent = `
      <h4>${healthOutcomesLayerNames.ASTHMA_PREVALENCE}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${currentAsthmaBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        currentAsthmaBreaks[5] + 0.1
      ).toFixed(1)}% - ${currentAsthmaBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        currentAsthmaBreaks[4] + 0.1
      ).toFixed(1)}% - ${currentAsthmaBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        currentAsthmaBreaks[3] + 0.1
      ).toFixed(1)}% - ${currentAsthmaBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        currentAsthmaBreaks[2] + 0.1
      ).toFixed(1)}% - ${currentAsthmaBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        currentAsthmaBreaks[1] + 0.1
      ).toFixed(1)}% - ${currentAsthmaBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        currentAsthmaBreaks[0] + 0.1
      ).toFixed(1)}% - ${currentAsthmaBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${currentAsthmaBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
    case healthOutcomesLayerNames.HIGH_BLOOD_PRESSURE:
      legendContent = `
      <h4>${healthOutcomesLayerNames.HIGH_BLOOD_PRESSURE}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${highBloodPressureBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        highBloodPressureBreaks[5] + 0.1
      ).toFixed(1)}% - ${highBloodPressureBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        highBloodPressureBreaks[4] + 0.1
      ).toFixed(1)}% - ${highBloodPressureBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        highBloodPressureBreaks[3] + 0.1
      ).toFixed(1)}% - ${highBloodPressureBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        highBloodPressureBreaks[2] + 0.1
      ).toFixed(1)}% - ${highBloodPressureBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        highBloodPressureBreaks[1] + 0.1
      ).toFixed(1)}% - ${highBloodPressureBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        highBloodPressureBreaks[0] + 0.1
      ).toFixed(1)}% - ${highBloodPressureBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${highBloodPressureBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
    case healthOutcomesLayerNames.CANCER_PREVALENCE:
      legendContent = `
      <h4>${healthOutcomesLayerNames.CANCER_PREVALENCE}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${cancerExceptSkinBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        cancerExceptSkinBreaks[5] + 0.1
      ).toFixed(1)}% - ${cancerExceptSkinBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        cancerExceptSkinBreaks[4] + 0.1
      ).toFixed(1)}% - ${cancerExceptSkinBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        cancerExceptSkinBreaks[3] + 0.1
      ).toFixed(1)}% - ${cancerExceptSkinBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        cancerExceptSkinBreaks[2] + 0.1
      ).toFixed(1)}% - ${cancerExceptSkinBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        cancerExceptSkinBreaks[1] + 0.1
      ).toFixed(1)}% - ${cancerExceptSkinBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        cancerExceptSkinBreaks[0] + 0.1
      ).toFixed(1)}% - ${cancerExceptSkinBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${cancerExceptSkinBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
    case healthOutcomesLayerNames.HIGH_CHOLESTEROL:
      legendContent = `
      <h4>${healthOutcomesLayerNames.HIGH_CHOLESTEROL}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${highCholesterolBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        highCholesterolBreaks[5] + 0.1
      ).toFixed(1)}% - ${highCholesterolBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        highCholesterolBreaks[4] + 0.1
      ).toFixed(1)}% - ${highCholesterolBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        highCholesterolBreaks[3] + 0.1
      ).toFixed(1)}% - ${highCholesterolBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        highCholesterolBreaks[2] + 0.1
      ).toFixed(1)}% - ${highCholesterolBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        highCholesterolBreaks[1] + 0.1
      ).toFixed(1)}% - ${highCholesterolBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        highCholesterolBreaks[0] + 0.1
      ).toFixed(1)}% - ${highCholesterolBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${highCholesterolBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
    case healthOutcomesLayerNames.CHRONIC_KIDNEY_DISEASE:
      legendContent = `
      <h4>${healthOutcomesLayerNames.CHRONIC_KIDNEY_DISEASE}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${chronicKidneyDiseaseBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        chronicKidneyDiseaseBreaks[5] + 0.1
      ).toFixed(1)}% - ${chronicKidneyDiseaseBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        chronicKidneyDiseaseBreaks[4] + 0.1
      ).toFixed(1)}% - ${chronicKidneyDiseaseBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        chronicKidneyDiseaseBreaks[3] + 0.1
      ).toFixed(1)}% - ${chronicKidneyDiseaseBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        chronicKidneyDiseaseBreaks[2] + 0.1
      ).toFixed(1)}% - ${chronicKidneyDiseaseBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        chronicKidneyDiseaseBreaks[1] + 0.1
      ).toFixed(1)}% - ${chronicKidneyDiseaseBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        chronicKidneyDiseaseBreaks[0] + 0.1
      ).toFixed(1)}% - ${chronicKidneyDiseaseBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${chronicKidneyDiseaseBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
    case healthOutcomesLayerNames.PULMONARY_DISEASE:
      legendContent = `
      <h4>${healthOutcomesLayerNames.PULMONARY_DISEASE}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${arthritisBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        arthritisBreaks[5] + 0.1
      ).toFixed(1)}% - ${arthritisBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        arthritisBreaks[4] + 0.1
      ).toFixed(1)}% - ${arthritisBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        arthritisBreaks[3] + 0.1
      ).toFixed(1)}% - ${arthritisBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        arthritisBreaks[2] + 0.1
      ).toFixed(1)}% - ${arthritisBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        arthritisBreaks[1] + 0.1
      ).toFixed(1)}% - ${arthritisBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        arthritisBreaks[0] + 0.1
      ).toFixed(1)}% - ${arthritisBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${arthritisBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
    case healthOutcomesLayerNames.HEART_DISEASE:
      legendContent = `
      <h4>${healthOutcomesLayerNames.HEART_DISEASE}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${coronaryHeartDiseaseBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        coronaryHeartDiseaseBreaks[5] + 0.1
      ).toFixed(1)}% - ${coronaryHeartDiseaseBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        coronaryHeartDiseaseBreaks[4] + 0.1
      ).toFixed(1)}% - ${coronaryHeartDiseaseBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        coronaryHeartDiseaseBreaks[3] + 0.1
      ).toFixed(1)}% - ${coronaryHeartDiseaseBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        coronaryHeartDiseaseBreaks[2] + 0.1
      ).toFixed(1)}% - ${coronaryHeartDiseaseBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        coronaryHeartDiseaseBreaks[1] + 0.1
      ).toFixed(1)}% - ${coronaryHeartDiseaseBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        coronaryHeartDiseaseBreaks[0] + 0.1
      ).toFixed(1)}% - ${coronaryHeartDiseaseBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${coronaryHeartDiseaseBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
    case healthOutcomesLayerNames.DIABETES_PREVALENCE:
      legendContent = `
      <h4>${healthOutcomesLayerNames.DIABETES_PREVALENCE}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${diabetesBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        diabetesBreaks[5] + 0.1
      ).toFixed(1)}% - ${diabetesBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        diabetesBreaks[4] + 0.1
      ).toFixed(1)}% - ${diabetesBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        diabetesBreaks[3] + 0.1
      ).toFixed(1)}% - ${diabetesBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        diabetesBreaks[2] + 0.1
      ).toFixed(1)}% - ${diabetesBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        diabetesBreaks[1] + 0.1
      ).toFixed(1)}% - ${diabetesBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        diabetesBreaks[0] + 0.1
      ).toFixed(1)}% - ${diabetesBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${diabetesBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
    case healthOutcomesLayerNames.OBESITY_PREVALENCE:
      legendContent = `
      <h4>${healthOutcomesLayerNames.OBESITY_PREVALENCE}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${obesityBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        obesityBreaks[5] + 0.1
      ).toFixed(1)}% - ${obesityBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        obesityBreaks[4] + 0.1
      ).toFixed(1)}% - ${obesityBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        obesityBreaks[3] + 0.1
      ).toFixed(1)}% - ${obesityBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        obesityBreaks[2] + 0.1
      ).toFixed(1)}% - ${obesityBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        obesityBreaks[1] + 0.1
      ).toFixed(1)}% - ${obesityBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        obesityBreaks[0] + 0.1
      ).toFixed(1)}% - ${obesityBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${obesityBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
    case healthOutcomesLayerNames.STROKE_PREVALENCE:
      legendContent = `
      <h4>${healthOutcomesLayerNames.STROKE_PREVALENCE}</h4>
      <i style="background: ${
        healthOutcomesColors[0]
      }"></i><span>> ${strokeBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[1]}"></i><span>${(
        strokeBreaks[5] + 0.1
      ).toFixed(1)}% - ${strokeBreaks[6].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[2]}"></i><span>${(
        strokeBreaks[4] + 0.1
      ).toFixed(1)}% - ${strokeBreaks[5].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[3]}"></i><span>${(
        strokeBreaks[3] + 0.1
      ).toFixed(1)}% - ${strokeBreaks[4].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[4]}"></i><span>${(
        strokeBreaks[2] + 0.1
      ).toFixed(1)}% - ${strokeBreaks[3].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[5]}"></i><span>${(
        strokeBreaks[1] + 0.1
      ).toFixed(1)}% - ${strokeBreaks[2].toFixed(1)}%</span><br>
      <i style="background: ${healthOutcomesColors[6]}"></i><span>${(
        strokeBreaks[0] + 0.1
      ).toFixed(1)}% - ${strokeBreaks[1].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[7]
      }"></i><span>0% - ${strokeBreaks[0].toFixed(1)}%</span><br>
      <i style="background: ${
        healthOutcomesColors[8]
      }"></i><span>No Data</span><br>
    `;
      break;
  }
  document.querySelector(".healthOutcomesLegend").innerHTML = legendContent;
  bringZipLayersToFront();
}

maps["healthOutcomesMap"].on("baselayerchange", function (e) {
  updateLegendForHealthOutcomes(e.name);
});

// Set asthma prevalence layer as the default
updateLegendForHealthOutcomes(healthOutcomesLayerNames.ASTHMA_PREVALENCE);
healthOutcomesLayers[healthOutcomesLayerNames.ASTHMA_PREVALENCE].addTo(
  maps["healthOutcomesMap"]
);

//=========================================================== Screening Rates Map =================================================================
maps["screeningRatesMap"] = L.map("screeningRatesMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11.5,
  zoomSnap: ZOOM_INCREMENT,
  zoomDelta: ZOOM_INCREMENT,
}).setView([40.65, -73.97], INITIAL_ZOOM_LEVEL);

var baseLayer4 = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2hlZW5hcCIsImEiOiJja25hdXE3aGcxbGI4MnVxbnFoenhwdGRrIn0.DhFwD-KlRigYLaVwL8ipGA",
  }
).addTo(maps["screeningRatesMap"]);

var screeningRatesLayers = {};
Object.values(screeningRatesLayerNames).forEach((layerName) => {
  screeningRatesLayers[layerName] = L.geoJson(null, {
    style: screeningRatesStyle(layerName, getColorScreeningRate(layerName)),
  });
});

function screeningRatesStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

function getColorScreeningRate(layerName) {
  switch (layerName) {
    case screeningRatesLayerNames.ANNUAL_CHECKUP:
      return getColorForAnnualCheckUp;
    case screeningRatesLayerNames.DENTAL_VISIT:
      return getColorForDentalVisit;
    case screeningRatesLayerNames.CHOLESTEROL_SCREENING:
      return getColorForCholesterolScreening;
    case screeningRatesLayerNames.MAMMOGRAPHY_SCREENING:
      return getColorForMammographyScreening;
    case screeningRatesLayerNames.CERVICAL_SCREENING:
      return getColorForCervicalScreening;
    case screeningRatesLayerNames.COLORECTAL_SCREENING:
      return getColorForColorectalScreening;
    default:
      return () => "#606060";
  }
}

function addScreeningRatesData(data) {
  data.features.forEach(function (feature) {
    if (feature.properties["County name"] != COUNTY_NAME) {
      return;
    }

    var p = feature.properties;

    var annualCheckUpPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated annual checkup crude prevalence is 
    <b>${p["Annual checkup crude prevalence (%)"]}%</b> 
    ${p["Annual checkup crude prevalence 95% CI"]}.
  `;

    var dentalVisitPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated dental visit crude prevalence is 
    <b>${p["Dental visit crude prevalence (%)"]}%</b> 
    ${p["Dental visit crude prevalence 95% CI"]}.
  `;

    var cholesterolScreeningPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated cholesterol screening crude prevalence is 
    <b>${p["Cholesterol screening crude prevalence (%)"]}%</b> 
    ${p["Cholesterol screening crude prevalence 95% CI"]}.
  `;

    var mammographyScreeningPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated mammography screening crude prevalence is 
    <b>${p["Mammography use crude prevalence (%)"]}%</b> 
    ${p["Mammography use crude prevalence 95% CI"]}.
  `;

    var cervicalScreeningPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated cervical screening crude prevalence is 
    <b>${p["Cervical cancer screening crude prevalence (%)"]}%</b> 
    ${p["Cervical cancer screening crude prevalence 95% CI"]}.
  `;

    var colorectalScreeningPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated colorectal screening crude prevalence is 
    <b>${p["Colorectal cancer screening crude prevalence (%)"]}%</b> 
    ${p["Colorectal cancer screening crude prevalence 95% CI"]}.
  `;

    var annualCheckUpLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Annual checkup crude prevalence (%)",
        getColorForAnnualCheckUp
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(annualCheckUpPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers[screeningRatesLayerNames.ANNUAL_CHECKUP].addLayer(
      annualCheckUpLayer
    );

    var dentalVisitLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Dental visit crude prevalence (%)",
        getColorForDentalVisit
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(dentalVisitPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers[screeningRatesLayerNames.DENTAL_VISIT].addLayer(
      dentalVisitLayer
    );

    var cholesterolScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Cholesterol screening crude prevalence (%)",
        getColorForCholesterolScreening
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(cholesterolScreeningPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers[
      screeningRatesLayerNames.CHOLESTEROL_SCREENING
    ].addLayer(cholesterolScreeningLayer);

    var mammographyScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Mammography use crude prevalence (%)",
        getColorForMammographyScreening
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(mammographyScreeningPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers[
      screeningRatesLayerNames.MAMMOGRAPHY_SCREENING
    ].addLayer(mammographyScreeningLayer);

    var cervicalScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Cervical cancer screening crude prevalence (%)",
        getColorForCervicalScreening
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(cervicalScreeningPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers[screeningRatesLayerNames.CERVICAL_SCREENING].addLayer(
      cervicalScreeningLayer
    );

    var colorectalScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Colorectal cancer screening crude prevalence (%)",
        getColorForColorectalScreening
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(colorectalScreeningPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    screeningRatesLayers[
      screeningRatesLayerNames.COLORECTAL_SCREENING
    ].addLayer(colorectalScreeningLayer);
  });
}

addScreeningRatesData(healthDataGeojson);

var screeningRatesBaseLayers = {
  [screeningRatesLayerNames.ANNUAL_CHECKUP]:
    screeningRatesLayers[screeningRatesLayerNames.ANNUAL_CHECKUP],
  [screeningRatesLayerNames.DENTAL_VISIT]:
    screeningRatesLayers[screeningRatesLayerNames.DENTAL_VISIT],
  [screeningRatesLayerNames.CHOLESTEROL_SCREENING]:
    screeningRatesLayers[screeningRatesLayerNames.CHOLESTEROL_SCREENING],
  [screeningRatesLayerNames.MAMMOGRAPHY_SCREENING]:
    screeningRatesLayers[screeningRatesLayerNames.MAMMOGRAPHY_SCREENING],
  [screeningRatesLayerNames.CERVICAL_SCREENING]:
    screeningRatesLayers[screeningRatesLayerNames.CERVICAL_SCREENING],
  [screeningRatesLayerNames.COLORECTAL_SCREENING]:
    screeningRatesLayers[screeningRatesLayerNames.COLORECTAL_SCREENING],
};

L.control
  .layers(screeningRatesBaseLayers, boundaries, { collapsed: false })
  .addTo(maps["screeningRatesMap"]);

// SCREENING RATES LEGEND CONTROL
var screeningRatesLegend = L.control({ position: "bottomleft" });

screeningRatesLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "screeningRatesLegend");
  div.innerHTML = `
  <h4>${screeningRatesLayerNames.ANNUAL_CHECKUP}</h4>
  <i style="background: ${
    screeningRatesColors[0]
  }"></i><span>> ${annualCheckupBreaks[6].toFixed(1)}%</span><br>
  <i style="background: ${screeningRatesColors[1]}"></i><span>${(
    annualCheckupBreaks[5] + 0.1
  ).toFixed(1)}% - ${annualCheckupBreaks[6].toFixed(1)}%</span><br>
  <i style="background: ${screeningRatesColors[2]}"></i><span>${(
    annualCheckupBreaks[4] + 0.1
  ).toFixed(1)}% - ${annualCheckupBreaks[5].toFixed(1)}%</span><br>
  <i style="background: ${screeningRatesColors[3]}"></i><span>${(
    annualCheckupBreaks[3] + 0.1
  ).toFixed(1)}% - ${annualCheckupBreaks[4].toFixed(1)}%</span><br>
  <i style="background: ${screeningRatesColors[4]}"></i><span>${(
    annualCheckupBreaks[2] + 0.1
  ).toFixed(1)}% - ${annualCheckupBreaks[3].toFixed(1)}%</span><br>
  <i style="background: ${screeningRatesColors[5]}"></i><span>${(
    annualCheckupBreaks[1] + 0.1
  ).toFixed(1)}% - ${annualCheckupBreaks[2].toFixed(1)}%</span><br>
  <i style="background: ${screeningRatesColors[6]}"></i><span>${(
    annualCheckupBreaks[0] + 0.1
  ).toFixed(1)}% - ${annualCheckupBreaks[1].toFixed(1)}%</span><br>
  <i style="background: ${
    screeningRatesColors[7]
  }"></i><span>0% - ${annualCheckupBreaks[0].toFixed(1)}%</span><br>
  <i style="background: ${screeningRatesColors[8]}"></i><span>No Data</span><br>
`;
  return div;
};

screeningRatesLegend.addTo(maps["screeningRatesMap"]);

function updateLegendForScreeningRates(layerName) {
  var legendContent = "";
  switch (layerName) {
    case screeningRatesLayerNames.ANNUAL_CHECKUP:
      legendContent = `
        <h4>${screeningRatesLayerNames.ANNUAL_CHECKUP}</h4>
        <i style="background: ${
          screeningRatesColors[0]
        }"></i><span>> ${annualCheckupBreaks[6].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[1]}"></i><span>${(
        annualCheckupBreaks[5] + 0.1
      ).toFixed(1)}% - ${annualCheckupBreaks[6].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[2]}"></i><span>${(
        annualCheckupBreaks[4] + 0.1
      ).toFixed(1)}% - ${annualCheckupBreaks[5].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[3]}"></i><span>${(
        annualCheckupBreaks[3] + 0.1
      ).toFixed(1)}% - ${annualCheckupBreaks[4].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[4]}"></i><span>${(
        annualCheckupBreaks[2] + 0.1
      ).toFixed(1)}% - ${annualCheckupBreaks[3].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[5]}"></i><span>${(
        annualCheckupBreaks[1] + 0.1
      ).toFixed(1)}% - ${annualCheckupBreaks[2].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[6]}"></i><span>${(
        annualCheckupBreaks[0] + 0.1
      ).toFixed(1)}% - ${annualCheckupBreaks[1].toFixed(1)}%</span><br>
        <i style="background: ${
          screeningRatesColors[7]
        }"></i><span>0% - ${annualCheckupBreaks[0].toFixed(1)}%</span><br>
        <i style="background: ${
          screeningRatesColors[8]
        }"></i><span>No Data</span><br>
      `;
      break;
    case screeningRatesLayerNames.DENTAL_VISIT:
      legendContent = `
        <h4>${screeningRatesLayerNames.DENTAL_VISIT}</h4>
        <i style="background: ${
          screeningRatesColors[0]
        }"></i><span>> ${dentalVisitBreaks[6].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[1]}"></i><span>${(
        dentalVisitBreaks[5] + 0.1
      ).toFixed(1)}% - ${dentalVisitBreaks[6].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[2]}"></i><span>${(
        dentalVisitBreaks[4] + 0.1
      ).toFixed(1)}% - ${dentalVisitBreaks[5].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[3]}"></i><span>${(
        dentalVisitBreaks[3] + 0.1
      ).toFixed(1)}% - ${dentalVisitBreaks[4].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[4]}"></i><span>${(
        dentalVisitBreaks[2] + 0.1
      ).toFixed(1)}% - ${dentalVisitBreaks[3].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[5]}"></i><span>${(
        dentalVisitBreaks[1] + 0.1
      ).toFixed(1)}% - ${dentalVisitBreaks[2].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[6]}"></i><span>${(
        dentalVisitBreaks[0] + 0.1
      ).toFixed(1)}% - ${dentalVisitBreaks[1].toFixed(1)}%</span><br>
        <i style="background: ${
          screeningRatesColors[7]
        }"></i><span>0% - ${dentalVisitBreaks[0].toFixed(1)}%</span><br>
        <i style="background: ${
          screeningRatesColors[8]
        }"></i><span>No Data</span><br>
      `;
      break;
    case screeningRatesLayerNames.CHOLESTEROL_SCREENING:
      legendContent = `
        <h4>${screeningRatesLayerNames.CHOLESTEROL_SCREENING}</h4>
        <i style="background: ${
          screeningRatesColors[0]
        }"></i><span>> ${cholesterolScreeningBreaks[6].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[1]}"></i><span>${(
        cholesterolScreeningBreaks[5] + 0.1
      ).toFixed(1)}% - ${cholesterolScreeningBreaks[6].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[2]}"></i><span>${(
        cholesterolScreeningBreaks[4] + 0.1
      ).toFixed(1)}% - ${cholesterolScreeningBreaks[5].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[3]}"></i><span>${(
        cholesterolScreeningBreaks[3] + 0.1
      ).toFixed(1)}% - ${cholesterolScreeningBreaks[4].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[4]}"></i><span>${(
        cholesterolScreeningBreaks[2] + 0.1
      ).toFixed(1)}% - ${cholesterolScreeningBreaks[3].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[5]}"></i><span>${(
        cholesterolScreeningBreaks[1] + 0.1
      ).toFixed(1)}% - ${cholesterolScreeningBreaks[2].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[6]}"></i><span>${(
        cholesterolScreeningBreaks[0] + 0.1
      ).toFixed(1)}% - ${cholesterolScreeningBreaks[1].toFixed(1)}%</span><br>
        <i style="background: ${
          screeningRatesColors[7]
        }"></i><span>0% - ${cholesterolScreeningBreaks[0].toFixed(
        1
      )}%</span><br>
        <i style="background: ${
          screeningRatesColors[8]
        }"></i><span>No Data</span><br>
      `;
      break;
    case screeningRatesLayerNames.MAMMOGRAPHY_SCREENING:
      legendContent = `
        <h4>${screeningRatesLayerNames.MAMMOGRAPHY_SCREENING}</h4>
        <i style="background: ${
          screeningRatesColors[0]
        }"></i><span>> ${mammographyUseBreaks[6].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[1]}"></i><span>${(
        mammographyUseBreaks[5] + 0.1
      ).toFixed(1)}% - ${mammographyUseBreaks[6].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[2]}"></i><span>${(
        mammographyUseBreaks[4] + 0.1
      ).toFixed(1)}% - ${mammographyUseBreaks[5].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[3]}"></i><span>${(
        mammographyUseBreaks[3] + 0.1
      ).toFixed(1)}% - ${mammographyUseBreaks[4].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[4]}"></i><span>${(
        mammographyUseBreaks[2] + 0.1
      ).toFixed(1)}% - ${mammographyUseBreaks[3].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[5]}"></i><span>${(
        mammographyUseBreaks[1] + 0.1
      ).toFixed(1)}% - ${mammographyUseBreaks[2].toFixed(1)}%</span><br>
        <i style="background: ${screeningRatesColors[6]}"></i><span>${(
        mammographyUseBreaks[0] + 0.1
      ).toFixed(1)}% - ${mammographyUseBreaks[1].toFixed(1)}%</span><br>
        <i style="background: ${
          screeningRatesColors[7]
        }"></i><span>0% - ${mammographyUseBreaks[0].toFixed(1)}%</span><br>
        <i style="background: ${
          screeningRatesColors[8]
        }"></i><span>No Data</span><br>
      `;
      break;
    case screeningRatesLayerNames.CERVICAL_SCREENING:
      legendContent = `
        <h4>${screeningRatesLayerNames.CERVICAL_SCREENING}</h4>
        <i style="background: ${
          screeningRatesColors[0]
        }"></i><span>> ${cervicalCancerScreeningBreaks[6].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[1]}"></i><span>${(
        cervicalCancerScreeningBreaks[5] + 0.1
      ).toFixed(1)}% - ${cervicalCancerScreeningBreaks[6].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[2]}"></i><span>${(
        cervicalCancerScreeningBreaks[4] + 0.1
      ).toFixed(1)}% - ${cervicalCancerScreeningBreaks[5].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[3]}"></i><span>${(
        cervicalCancerScreeningBreaks[3] + 0.1
      ).toFixed(1)}% - ${cervicalCancerScreeningBreaks[4].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[4]}"></i><span>${(
        cervicalCancerScreeningBreaks[2] + 0.1
      ).toFixed(1)}% - ${cervicalCancerScreeningBreaks[3].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[5]}"></i><span>${(
        cervicalCancerScreeningBreaks[1] + 0.1
      ).toFixed(1)}% - ${cervicalCancerScreeningBreaks[2].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[6]}"></i><span>${(
        cervicalCancerScreeningBreaks[0] + 0.1
      ).toFixed(1)}% - ${cervicalCancerScreeningBreaks[1].toFixed(
        1
      )}%</span><br>
        <i style="background: ${
          screeningRatesColors[7]
        }"></i><span>0% - ${cervicalCancerScreeningBreaks[0].toFixed(
        1
      )}%</span><br>
        <i style="background: ${
          screeningRatesColors[8]
        }"></i><span>No Data</span><br>
      `;
      break;
    case screeningRatesLayerNames.COLORECTAL_SCREENING:
      legendContent = `
        <h4>${screeningRatesLayerNames.COLORECTAL_SCREENING}</h4>
        <i style="background: ${
          screeningRatesColors[0]
        }"></i><span>> ${colorectalCancerScreeningBreaks[6].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[1]}"></i><span>${(
        colorectalCancerScreeningBreaks[5] + 0.1
      ).toFixed(1)}% - ${colorectalCancerScreeningBreaks[6].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[2]}"></i><span>${(
        colorectalCancerScreeningBreaks[4] + 0.1
      ).toFixed(1)}% - ${colorectalCancerScreeningBreaks[5].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[3]}"></i><span>${(
        colorectalCancerScreeningBreaks[3] + 0.1
      ).toFixed(1)}% - ${colorectalCancerScreeningBreaks[4].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[4]}"></i><span>${(
        colorectalCancerScreeningBreaks[2] + 0.1
      ).toFixed(1)}% - ${colorectalCancerScreeningBreaks[3].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[5]}"></i><span>${(
        colorectalCancerScreeningBreaks[1] + 0.1
      ).toFixed(1)}% - ${colorectalCancerScreeningBreaks[2].toFixed(
        1
      )}%</span><br>
        <i style="background: ${screeningRatesColors[6]}"></i><span>${(
        colorectalCancerScreeningBreaks[0] + 0.1
      ).toFixed(1)}% - ${colorectalCancerScreeningBreaks[1].toFixed(
        1
      )}%</span><br>
        <i style="background: ${
          screeningRatesColors[7]
        }"></i><span>0% - ${colorectalCancerScreeningBreaks[0].toFixed(
        1
      )}%</span><br>
        <i style="background: ${
          screeningRatesColors[8]
        }"></i><span>No Data</span><br>
      `;
      break;
  }
  document.querySelector(".screeningRatesLegend").innerHTML = legendContent;
  bringZipLayersToFront();
}

maps["screeningRatesMap"].on("baselayerchange", function (e) {
  updateLegendForScreeningRates(e.name);
});

// Set annualCheckUp layer as the default
updateLegendForScreeningRates(screeningRatesLayerNames.ANNUAL_CHECKUP);
screeningRatesLayers[screeningRatesLayerNames.ANNUAL_CHECKUP].addTo(
  maps["screeningRatesMap"]
);

//=========================================================== Health Status Map =================================================================
maps["healthStatusMap"] = L.map("healthStatusMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11.5,
  zoomSnap: ZOOM_INCREMENT,
  zoomDelta: ZOOM_INCREMENT,
}).setView([40.65, -73.97], INITIAL_ZOOM_LEVEL);

var baseLayer5 = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2hlZW5hcCIsImEiOiJja25hdXE3aGcxbGI4MnVxbnFoenhwdGRrIn0.DhFwD-KlRigYLaVwL8ipGA",
  }
).addTo(maps["healthStatusMap"]);

// Define health status layers
var healthStatusLayers = {};
Object.values(healthStatusLayerNames).forEach((layerName) => {
  healthStatusLayers[layerName] = L.geoJson(null, {
    style: healthStatusStyle(layerName, getColorHealthStatus(layerName)),
  });
});

function healthStatusStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

// Color functions
function getColorHealthStatus(layerName) {
  switch (layerName) {
    case healthStatusLayerNames.DEPRESSION:
      return getColorForDepression;
    case healthStatusLayerNames.MENTAL_HEALTH_BAD:
      return getColorForMentalHealthBad;
    case healthStatusLayerNames.PHYSICAL_HEALTH_BAD:
      return getColorForPhysicalHealthBad;
    case healthStatusLayerNames.POOR_SELF_RATED_HEALTH:
      return getColorForPoorSelfRatedHealth;
    case healthStatusLayerNames.DISABILITY:
      return getColorForDisability;
    case healthStatusLayerNames.HEARING_DISABILITY:
      return getColorForHearingDisability;
    case healthStatusLayerNames.VISION_DISABILITY:
      return getColorForVisionDisability;
    case healthStatusLayerNames.COGNITIVE_DISABILITY:
      return getColorForCognitiveDisability;
    case healthStatusLayerNames.MOBILITY_DISABILITY:
      return getColorForMobilityDisability;
    case healthStatusLayerNames.SELF_CARE_DISABILITY:
      return getColorForSelfCareDisability;
    case healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY:
      return getColorForIndependentLivingDisability;
    default:
      return () => "#606060"; // Default color if no match found
  }
}

function addHealthStatusData(data) {
  data.features.forEach(function (feature) {
    if (feature.properties["County name"] != COUNTY_NAME) {
      return;
    }

    var p = feature.properties;

    var depressionPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated depression crude prevalence is 
    <b>${p["Depression crude prevalence (%)"]}%</b> 
    ${p["Depression crude prevalence 95% CI"]}.
  `;

    var mentalHealthBadPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated frequent mental health distress crude prevalence is 
    <b>${p["Frequent mental health distress crude prevalence (%)"]}%</b> 
    ${p["Frequent mental health distress crude prevalence 95% CI"]}.
  `;

    var physicalHealthBadPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated frequent physical health distress crude prevalence is 
    <b>${p["Frequent physical health distress crude prevalence (%)"]}%</b> 
    ${p["Frequent physical health distress crude prevalence 95% CI"]}.
  `;

    var poorSelfRatedHealthPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated fair or poor health crude prevalence is 
    <b>${p["Fair or poor health crude prevalence (%)"]}%</b> 
    ${p["Fair or poor health crude prevalence 95% CI"]}.
  `;

    var disabilityPopup = `
    <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
    Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated any disability crude prevalence is 
    <b>${p["Any disability crude prevalence (%)"]}%</b> 
    ${p["Any disability crude prevalence 95% CI"]}.
  `;

    var depressionLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Depression crude prevalence (%)",
        getColorForDepression
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(depressionPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.DEPRESSION].addLayer(
      depressionLayer
    );

    var mentalHealthBadLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Frequent mental health distress crude prevalence (%)",
        getColorForMentalHealthBad
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(mentalHealthBadPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.MENTAL_HEALTH_BAD].addLayer(
      mentalHealthBadLayer
    );

    var physicalHealthBadLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Frequent physical health distress crude prevalence (%)",
        getColorForPhysicalHealthBad
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(physicalHealthBadPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.PHYSICAL_HEALTH_BAD].addLayer(
      physicalHealthBadLayer
    );

    var poorSelfRatedHealthLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Fair or poor health crude prevalence (%)",
        getColorForPoorSelfRatedHealth
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(poorSelfRatedHealthPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.POOR_SELF_RATED_HEALTH].addLayer(
      poorSelfRatedHealthLayer
    );

    var disabilityLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Any disability crude prevalence (%)",
        getColorForDisability
      ),
      onEachFeature: function (feature, layer) {
        var popup = L.responsivePopup().setContent(disabilityPopup);
        layer.bindPopup(popup);
        allFeatures(feature, layer);
      },
    });
    healthStatusLayers[healthStatusLayerNames.DISABILITY].addLayer(
      disabilityLayer
    );
  });
}

addHealthStatusData(healthDataGeojson);

var healthStatusBaseLayers = {
  [healthStatusLayerNames.DEPRESSION]:
    healthStatusLayers[healthStatusLayerNames.DEPRESSION],
  [healthStatusLayerNames.MENTAL_HEALTH_BAD]:
    healthStatusLayers[healthStatusLayerNames.MENTAL_HEALTH_BAD],
  [healthStatusLayerNames.PHYSICAL_HEALTH_BAD]:
    healthStatusLayers[healthStatusLayerNames.PHYSICAL_HEALTH_BAD],
  [healthStatusLayerNames.POOR_SELF_RATED_HEALTH]:
    healthStatusLayers[healthStatusLayerNames.POOR_SELF_RATED_HEALTH],
  [healthStatusLayerNames.DISABILITY]:
    healthStatusLayers[healthStatusLayerNames.DISABILITY],
};

L.control
  .layers(healthStatusBaseLayers, boundaries, { collapsed: false })
  .addTo(maps["healthStatusMap"]);

// HEALTH STATUS LEGEND CONTROL
var healthStatusLegend = L.control({ position: "bottomleft" });

healthStatusLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "healthStatusLegend");
  div.innerHTML = `
  <h4>${healthStatusLayerNames.DEPRESSION}</h4>
  <i style="background: ${
    healthStatusColors[0]
  }"></i><span>> ${depressionBreaks[6].toFixed(1)}%</span><br>
  <i style="background: ${healthStatusColors[1]}"></i><span>${(
    depressionBreaks[5] + 0.1
  ).toFixed(1)}% - ${depressionBreaks[6].toFixed(1)}%</span><br>
  <i style="background: ${healthStatusColors[2]}"></i><span>${(
    depressionBreaks[4] + 0.1
  ).toFixed(1)}% - ${depressionBreaks[5].toFixed(1)}%</span><br>
  <i style="background: ${healthStatusColors[3]}"></i><span>${(
    depressionBreaks[3] + 0.1
  ).toFixed(1)}% - ${depressionBreaks[4].toFixed(1)}%</span><br>
  <i style="background: ${healthStatusColors[4]}"></i><span>${(
    depressionBreaks[2] + 0.1
  ).toFixed(1)}% - ${depressionBreaks[3].toFixed(1)}%</span><br>
  <i style="background: ${healthStatusColors[5]}"></i><span>${(
    depressionBreaks[1] + 0.1
  ).toFixed(1)}% - ${depressionBreaks[2].toFixed(1)}%</span><br>
  <i style="background: ${healthStatusColors[6]}"></i><span>${(
    depressionBreaks[0] + 0.1
  ).toFixed(1)}% - ${depressionBreaks[1].toFixed(1)}%</span><br>
  <i style="background: ${
    healthStatusColors[7]
  }"></i><span>0% - ${depressionBreaks[0].toFixed(1)}%</span><br>
  <i style="background: ${healthStatusColors[8]}"></i><span>No Data</span><br>
`;
  return div;
};

healthStatusLegend.addTo(maps["healthStatusMap"]);

function updateLegendForHealthStatus(layerName) {
  var legendContent = "";
  switch (layerName) {
    case healthStatusLayerNames.DEPRESSION:
      legendContent = `
          <h4>${healthStatusLayerNames.DEPRESSION}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${depressionBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        depressionBreaks[5] + 0.1
      ).toFixed(1)}% - ${depressionBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        depressionBreaks[4] + 0.1
      ).toFixed(1)}% - ${depressionBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        depressionBreaks[3] + 0.1
      ).toFixed(1)}% - ${depressionBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        depressionBreaks[2] + 0.1
      ).toFixed(1)}% - ${depressionBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        depressionBreaks[1] + 0.1
      ).toFixed(1)}% - ${depressionBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        depressionBreaks[0] + 0.1
      ).toFixed(1)}% - ${depressionBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${depressionBreaks[0].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.MENTAL_HEALTH_BAD:
      legendContent = `
          <h4>${healthStatusLayerNames.MENTAL_HEALTH_BAD}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${frequentMentalHealthDistressBreaks[6].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        frequentMentalHealthDistressBreaks[5] + 0.1
      ).toFixed(1)}% - ${frequentMentalHealthDistressBreaks[6].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        frequentMentalHealthDistressBreaks[4] + 0.1
      ).toFixed(1)}% - ${frequentMentalHealthDistressBreaks[5].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        frequentMentalHealthDistressBreaks[3] + 0.1
      ).toFixed(1)}% - ${frequentMentalHealthDistressBreaks[4].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        frequentMentalHealthDistressBreaks[2] + 0.1
      ).toFixed(1)}% - ${frequentMentalHealthDistressBreaks[3].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        frequentMentalHealthDistressBreaks[1] + 0.1
      ).toFixed(1)}% - ${frequentMentalHealthDistressBreaks[2].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        frequentMentalHealthDistressBreaks[0] + 0.1
      ).toFixed(1)}% - ${frequentMentalHealthDistressBreaks[1].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${frequentMentalHealthDistressBreaks[0].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.PHYSICAL_HEALTH_BAD:
      legendContent = `
          <h4>${healthStatusLayerNames.PHYSICAL_HEALTH_BAD}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${frequentPhysicalHealthDistressBreaks[6].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        frequentPhysicalHealthDistressBreaks[5] + 0.1
      ).toFixed(1)}% - ${frequentPhysicalHealthDistressBreaks[6].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        frequentPhysicalHealthDistressBreaks[4] + 0.1
      ).toFixed(1)}% - ${frequentPhysicalHealthDistressBreaks[5].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        frequentPhysicalHealthDistressBreaks[3] + 0.1
      ).toFixed(1)}% - ${frequentPhysicalHealthDistressBreaks[4].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        frequentPhysicalHealthDistressBreaks[2] + 0.1
      ).toFixed(1)}% - ${frequentPhysicalHealthDistressBreaks[3].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        frequentPhysicalHealthDistressBreaks[1] + 0.1
      ).toFixed(1)}% - ${frequentPhysicalHealthDistressBreaks[2].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        frequentPhysicalHealthDistressBreaks[0] + 0.1
      ).toFixed(1)}% - ${frequentPhysicalHealthDistressBreaks[1].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${frequentPhysicalHealthDistressBreaks[0].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.POOR_SELF_RATED_HEALTH:
      legendContent = `
          <h4>${healthStatusLayerNames.POOR_SELF_RATED_HEALTH}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${fairOrPoorHealthBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        fairOrPoorHealthBreaks[5] + 0.1
      ).toFixed(1)}% - ${fairOrPoorHealthBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        fairOrPoorHealthBreaks[4] + 0.1
      ).toFixed(1)}% - ${fairOrPoorHealthBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        fairOrPoorHealthBreaks[3] + 0.1
      ).toFixed(1)}% - ${fairOrPoorHealthBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        fairOrPoorHealthBreaks[2] + 0.1
      ).toFixed(1)}% - ${fairOrPoorHealthBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        fairOrPoorHealthBreaks[1] + 0.1
      ).toFixed(1)}% - ${fairOrPoorHealthBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        fairOrPoorHealthBreaks[0] + 0.1
      ).toFixed(1)}% - ${fairOrPoorHealthBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${fairOrPoorHealthBreaks[0].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.DISABILITY}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${anyDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        anyDisabilityBreaks[5] + 0.1
      ).toFixed(1)}% - ${anyDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        anyDisabilityBreaks[4] + 0.1
      ).toFixed(1)}% - ${anyDisabilityBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        anyDisabilityBreaks[3] + 0.1
      ).toFixed(1)}% - ${anyDisabilityBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        anyDisabilityBreaks[2] + 0.1
      ).toFixed(1)}% - ${anyDisabilityBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        anyDisabilityBreaks[1] + 0.1
      ).toFixed(1)}% - ${anyDisabilityBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        anyDisabilityBreaks[0] + 0.1
      ).toFixed(1)}% - ${anyDisabilityBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${anyDisabilityBreaks[0].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.HEARING_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.HEARING_DISABILITY}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${hearingDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        hearingDisabilityBreaks[5] + 0.1
      ).toFixed(1)}% - ${hearingDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        hearingDisabilityBreaks[4] + 0.1
      ).toFixed(1)}% - ${hearingDisabilityBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        hearingDisabilityBreaks[3] + 0.1
      ).toFixed(1)}% - ${hearingDisabilityBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        hearingDisabilityBreaks[2] + 0.1
      ).toFixed(1)}% - ${hearingDisabilityBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        hearingDisabilityBreaks[1] + 0.1
      ).toFixed(1)}% - ${hearingDisabilityBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        hearingDisabilityBreaks[0] + 0.1
      ).toFixed(1)}% - ${hearingDisabilityBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${hearingDisabilityBreaks[0].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.VISION_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.VISION_DISABILITY}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${visionDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        visionDisabilityBreaks[5] + 0.1
      ).toFixed(1)}% - ${visionDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        visionDisabilityBreaks[4] + 0.1
      ).toFixed(1)}% - ${visionDisabilityBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        visionDisabilityBreaks[3] + 0.1
      ).toFixed(1)}% - ${visionDisabilityBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        visionDisabilityBreaks[2] + 0.1
      ).toFixed(1)}% - ${visionDisabilityBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        visionDisabilityBreaks[1] + 0.1
      ).toFixed(1)}% - ${visionDisabilityBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        visionDisabilityBreaks[0] + 0.1
      ).toFixed(1)}% - ${visionDisabilityBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${visionDisabilityBreaks[0].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.COGNITIVE_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.COGNITIVE_DISABILITY}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${cognitiveDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        cognitiveDisabilityBreaks[5] + 0.1
      ).toFixed(1)}% - ${cognitiveDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        cognitiveDisabilityBreaks[4] + 0.1
      ).toFixed(1)}% - ${cognitiveDisabilityBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        cognitiveDisabilityBreaks[3] + 0.1
      ).toFixed(1)}% - ${cognitiveDisabilityBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        cognitiveDisabilityBreaks[2] + 0.1
      ).toFixed(1)}% - ${cognitiveDisabilityBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        cognitiveDisabilityBreaks[1] + 0.1
      ).toFixed(1)}% - ${cognitiveDisabilityBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        cognitiveDisabilityBreaks[0] + 0.1
      ).toFixed(1)}% - ${cognitiveDisabilityBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${cognitiveDisabilityBreaks[0].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.MOBILITY_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.MOBILITY_DISABILITY}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${mobilityDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        mobilityDisabilityBreaks[5] + 0.1
      ).toFixed(1)}% - ${mobilityDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        mobilityDisabilityBreaks[4] + 0.1
      ).toFixed(1)}% - ${mobilityDisabilityBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        mobilityDisabilityBreaks[3] + 0.1
      ).toFixed(1)}% - ${mobilityDisabilityBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        mobilityDisabilityBreaks[2] + 0.1
      ).toFixed(1)}% - ${mobilityDisabilityBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        mobilityDisabilityBreaks[1] + 0.1
      ).toFixed(1)}% - ${mobilityDisabilityBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        mobilityDisabilityBreaks[0] + 0.1
      ).toFixed(1)}% - ${mobilityDisabilityBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${mobilityDisabilityBreaks[0].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.SELF_CARE_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.SELF_CARE_DISABILITY}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${selfCareDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        selfCareDisabilityBreaks[5] + 0.1
      ).toFixed(1)}% - ${selfCareDisabilityBreaks[6].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        selfCareDisabilityBreaks[4] + 0.1
      ).toFixed(1)}% - ${selfCareDisabilityBreaks[5].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        selfCareDisabilityBreaks[3] + 0.1
      ).toFixed(1)}% - ${selfCareDisabilityBreaks[4].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        selfCareDisabilityBreaks[2] + 0.1
      ).toFixed(1)}% - ${selfCareDisabilityBreaks[3].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        selfCareDisabilityBreaks[1] + 0.1
      ).toFixed(1)}% - ${selfCareDisabilityBreaks[2].toFixed(1)}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        selfCareDisabilityBreaks[0] + 0.1
      ).toFixed(1)}% - ${selfCareDisabilityBreaks[1].toFixed(1)}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${selfCareDisabilityBreaks[0].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
    case healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY:
      legendContent = `
          <h4>${healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY}</h4>
          <i style="background: ${
            healthStatusColors[0]
          }"></i><span>> ${independentLivingDisabilityBreaks[6].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[1]}"></i><span>${(
        independentLivingDisabilityBreaks[5] + 0.1
      ).toFixed(1)}% - ${independentLivingDisabilityBreaks[6].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[2]}"></i><span>${(
        independentLivingDisabilityBreaks[4] + 0.1
      ).toFixed(1)}% - ${independentLivingDisabilityBreaks[5].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[3]}"></i><span>${(
        independentLivingDisabilityBreaks[3] + 0.1
      ).toFixed(1)}% - ${independentLivingDisabilityBreaks[4].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[4]}"></i><span>${(
        independentLivingDisabilityBreaks[2] + 0.1
      ).toFixed(1)}% - ${independentLivingDisabilityBreaks[3].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[5]}"></i><span>${(
        independentLivingDisabilityBreaks[1] + 0.1
      ).toFixed(1)}% - ${independentLivingDisabilityBreaks[2].toFixed(
        1
      )}%</span><br>
          <i style="background: ${healthStatusColors[6]}"></i><span>${(
        independentLivingDisabilityBreaks[0] + 0.1
      ).toFixed(1)}% - ${independentLivingDisabilityBreaks[1].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthStatusColors[7]
          }"></i><span>0% - ${independentLivingDisabilityBreaks[0].toFixed(
        1
      )}%</span><br>
          <i style="background: ${
            healthStatusColors[8]
          }"></i><span>No Data</span><br>
        `;
      break;
  }
  document.querySelector(".healthStatusLegend").innerHTML = legendContent;
  bringZipLayersToFront();
}

maps["healthStatusMap"].on("baselayerchange", function (e) {
  updateLegendForHealthStatus(e.name);
});

// Set depression layer as the default
updateLegendForHealthStatus(healthStatusLayerNames.DEPRESSION);
healthStatusLayers[healthStatusLayerNames.DEPRESSION].addTo(
  maps["healthStatusMap"]
);

//=========================================================== Health Status DROPDOWN =================================================================

var disabilityControl;

var DisabilityControl = L.Control.extend({
  // Position
  options: {
    position: "topright",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "disability-control");

    var select = L.DomUtil.create("select", "", container);
    select.id = "disabilitySelect";
    select.onchange = updateHealthStatusMap;

    var disabilities = [
      {
        value: healthStatusLayerNames.DISABILITY,
        text: healthStatusLayerNames.DISABILITY,
      },
      {
        value: healthStatusLayerNames.HEARING_DISABILITY,
        text: healthStatusLayerNames.HEARING_DISABILITY,
      },
      {
        value: healthStatusLayerNames.VISION_DISABILITY,
        text: healthStatusLayerNames.VISION_DISABILITY,
      },
      {
        value: healthStatusLayerNames.COGNITIVE_DISABILITY,
        text: healthStatusLayerNames.COGNITIVE_DISABILITY,
      },
      {
        value: healthStatusLayerNames.MOBILITY_DISABILITY,
        text: healthStatusLayerNames.MOBILITY_DISABILITY,
      },
      {
        value: healthStatusLayerNames.SELF_CARE_DISABILITY,
        text: healthStatusLayerNames.SELF_CARE_DISABILITY,
      },
      {
        value: healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY,
        text: healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY,
      },
    ];

    // Populate dropdown
    for (var i = 0; i < disabilities.length; i++) {
      var option = L.DomUtil.create("option", "", select);
      option.value = disabilities[i].value;
      option.text = disabilities[i].text;
    }

    return container;
  },
});

function addDisabilityControl() {
  if (!disabilityControl) {
    disabilityControl = new DisabilityControl();
    maps["healthStatusMap"].addControl(disabilityControl);
  }
}

function removeDisabilityControl() {
  if (disabilityControl) {
    maps["healthStatusMap"].removeControl(disabilityControl);
    disabilityControl = null;
  }
}

function updateHealthStatusMap() {
  // Get selected disability from the dropdown
  var selectedDisability = document.getElementById("disabilitySelect").value;

  // Clear existing layer
  healthStatusLayers[healthStatusLayerNames.DISABILITY].clearLayers();

  // Add new layer based on the selected disability
  var selectedDisabilityGeojson = L.geoJson(healthDataGeojson, {
    filter: function (feature) {
      return feature.properties["County name"] == COUNTY_NAME;
    },

    style: function (feature) {
      var style;
      if (selectedDisability == healthStatusLayerNames.HEARING_DISABILITY) {
        style = {
          fillColor: getColorForHearingDisability(
            feature.properties["Hearing disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability == healthStatusLayerNames.VISION_DISABILITY
      ) {
        style = {
          fillColor: getColorForVisionDisability(
            feature.properties["Vision disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability == healthStatusLayerNames.COGNITIVE_DISABILITY
      ) {
        style = {
          fillColor: getColorForCognitiveDisability(
            feature.properties["Cognitive disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability == healthStatusLayerNames.MOBILITY_DISABILITY
      ) {
        style = {
          fillColor: getColorForMobilityDisability(
            feature.properties["Mobility disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability == healthStatusLayerNames.SELF_CARE_DISABILITY
      ) {
        style = {
          fillColor: getColorForSelfCareDisability(
            feature.properties["Self-care disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else if (
        selectedDisability ==
        healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY
      ) {
        style = {
          fillColor: getColorForIndependentLivingDisability(
            feature.properties[
              "Independent living disability crude prevalence (%)"
            ]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else {
        // Default style for any disability (if no specific disability is selected)
        style = {
          fillColor: getColorForDisability(
            feature.properties["Any disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      }
      return style;
    },

    // Adding a popup for each feature
    onEachFeature: function (feature, layer) {
      if (feature.properties["County name"] != COUNTY_NAME) {
        return;
      }

      var p = feature.properties;

      var popupContent;
      if (selectedDisability == healthStatusLayerNames.DISABILITY) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated any disability crude prevalence is 
          <b>${p["Any disability crude prevalence (%)"]}%</b> 
          ${p["Any disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.HEARING_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated hearing disability crude prevalence is 
          <b>${p["Hearing disability crude prevalence (%)"]}%</b> 
          ${p["Hearing disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.VISION_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated vision disability crude prevalence is 
          <b>${p["Vision disability crude prevalence (%)"]}%</b> 
          ${p["Vision disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.COGNITIVE_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated cognitive disability crude prevalence is 
          <b>${p["Cognitive disability crude prevalence (%)"]}%</b> 
          ${p["Cognitive disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.MOBILITY_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated mobility disability crude prevalence is 
          <b>${p["Mobility disability crude prevalence (%)"]}%</b> 
          ${p["Mobility disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability == healthStatusLayerNames.SELF_CARE_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated self-care disability (e.g., dressing or bathing) crude prevalence is 
          <b>${p["Self-care disability crude prevalence (%)"]}%</b> 
          ${p["Self-care disability crude prevalence 95% CI"]}.
        `;
      } else if (
        selectedDisability ==
        healthStatusLayerNames.INDEPENDENT_LIVING_DISABILITY
      ) {
        popupContent = `
          <h3>Census tract: ${p["Census tract FIPS"]}</h3><br>
          Approximately <b>${p["Total population 2010"]}</b> people live in this census tract, and the estimated independent living (e.g., difficulty doing errands alone) disability crude prevalence is 
          <b>${p["Independent living disability crude prevalence (%)"]}%</b> 
          ${p["Independent living disability crude prevalence 95% CI"]}.
        `;
      }

      var popup = L.responsivePopup().setContent(popupContent);
      layer.bindPopup(popup);

      allFeatures(feature, layer);
    },
  }).addTo(healthStatusLayers[healthStatusLayerNames.DISABILITY]);

  // Update the legend based on selected layer and disability
  selectedLayer = healthStatusLayerNames.DISABILITY;
  updateLegendForHealthStatus(selectedDisability);
}

// Eventlistener for baselayer change to toggle disability dropdown
maps["healthStatusMap"].on("baselayerchange", function (e) {
  if (e.name === healthStatusLayerNames.DISABILITY) {
    addDisabilityControl();
    // Default back to "Any Disability"
    document.getElementById("disabilitySelect").value =
      healthStatusLayerNames.DISABILITY;
    updateHealthStatusMap();
  } else {
    removeDisabilityControl();
  }
});

// Set depression layer as the default
updateLegendForHealthStatus(healthStatusLayerNames.DEPRESSION);
healthStatusLayers[healthStatusLayerNames.DEPRESSION].addTo(
  maps["healthStatusMap"]
);

//=========================================================== ZIP CODE =================================================================
selectedMap = maps["demographicLanguageMap"];
var zipHighlightLayer = {};
var zipBoundaryLayer = {};

// Add highlight layer and boundaries to each map
Object.keys(maps).forEach((mapId) => {
  zipHighlightLayer[mapId] = L.geoJson(null, {
    style: {
      color: "yellow",
      weight: 5,
      fillOpacity: 0,
    },
    interactive: false,
  }).addTo(maps[mapId]);

  zipBoundaryLayer[mapId] = L.geoJson(zipCodeBoundaries, {
    style: {
      fillColor: "transparent",
      color: "transparent",
      opacity: 0,
      fillOpacity: 0,
    },
    interactive: false,
  }).addTo(maps[mapId]);
});

// Listen for custom highlightZipCode event to highlight that zip code area
document.addEventListener("highlightZipCode", function (event) {
  const zipCode = event.detail.zipCode;
  highlightBoundary(zipCode);
});

function highlightBoundary(zipCode) {
  // Clear previous highlights
  Object.keys(zipHighlightLayer).forEach((mapId) => {
    zipHighlightLayer[mapId].clearLayers();
  });

  // Highlight selected zip code on the selected map
  zipBoundaryLayer[selectedMap._container.id].eachLayer(function (layer) {
    if (layer.feature.properties.ZIPCODE == zipCode) {
      zipHighlightLayer[selectedMap._container.id].addData(layer.feature);
      layer.bringToFront();
    }
  });
}

function bringZipLayersToFront() {
  if (zipHighlightLayer && zipBoundaryLayer) {
    zipHighlightLayer[selectedMap._container.id].bringToFront();
    zipBoundaryLayer[selectedMap._container.id].bringToFront();
  }
}

//=========================================================== COLOR FUNCTIONS =================================================================
//=========================================================== LANGUAGE COLOR FUNCTIONS =================================================================
function getColorBasedOnLanguageLegend(language) {
  return language == "Arabic"
    ? "#51eba6ff"
    : language == "Chinese"
    ? "#963f92ff"
    : language == "French, Haitian Creole, or Cajun"
    ? "#30bfc7ff" 
    : language == "German or other West Germanic languages"
    ? "#3288bd"
    : language == "Korean"
    ? "#e7298a"
    : language == "Other and unspecified languages"
    ? "#f0d36e"
    : language == "Other Asian and Pacific Island languages"
    ? "#795cb8"
    : language == "Other Indo-European languages"
    ? "#507587"
    : language == "Russian, Polish, or other Slavic languages"
    ? "#e28513ff"
    : language == "Spanish"
    ? "#41ab5d"
    : language == "Tagalog (incl. Filipino)"
    ? "#eb554dff"
    : language == "Vietnamese"
    ? "#c7e9b4"
    : "#606060";
}

function getColorForArabic(value) {
  return value > arabicBreaks[6]
    ? languageColors[0]
    : value > arabicBreaks[5]
    ? languageColors[1]
    : value > arabicBreaks[4]
    ? languageColors[2]
    : value > arabicBreaks[3]
    ? languageColors[3]
    : value > arabicBreaks[2]
    ? languageColors[4]
    : value > arabicBreaks[1]
    ? languageColors[5]
    : value >= arabicBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForChinese(value) {
  return value > chineseBreaks[6]
    ? languageColors[0]
    : value > chineseBreaks[5]
    ? languageColors[1]
    : value > chineseBreaks[4]
    ? languageColors[2]
    : value > chineseBreaks[3]
    ? languageColors[3]
    : value > chineseBreaks[2]
    ? languageColors[4]
    : value > chineseBreaks[1]
    ? languageColors[5]
    : value >= chineseBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForFrench(value) {
  return value > frenchBreaks[6]
    ? languageColors[0]
    : value > frenchBreaks[5]
    ? languageColors[1]
    : value > frenchBreaks[4]
    ? languageColors[2]
    : value > frenchBreaks[3]
    ? languageColors[3]
    : value > frenchBreaks[2]
    ? languageColors[4]
    : value > frenchBreaks[1]
    ? languageColors[5]
    : value >= frenchBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForGerman(value) {
  return value > germanBreaks[6]
    ? languageColors[0]
    : value > germanBreaks[5]
    ? languageColors[1]
    : value > germanBreaks[4]
    ? languageColors[2]
    : value > germanBreaks[3]
    ? languageColors[3]
    : value > germanBreaks[2]
    ? languageColors[4]
    : value > germanBreaks[1]
    ? languageColors[5]
    : value >= germanBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForKorean(value) {
  return value > koreanBreaks[6]
    ? languageColors[0]
    : value > koreanBreaks[5]
    ? languageColors[1]
    : value > koreanBreaks[4]
    ? languageColors[2]
    : value > koreanBreaks[3]
    ? languageColors[3]
    : value > koreanBreaks[2]
    ? languageColors[4]
    : value > koreanBreaks[1]
    ? languageColors[5]
    : value >= koreanBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForOther(value) {
  return value > otherBreaks[6]
    ? languageColors[0]
    : value > otherBreaks[5]
    ? languageColors[1]
    : value > otherBreaks[4]
    ? languageColors[2]
    : value > otherBreaks[3]
    ? languageColors[3]
    : value > otherBreaks[2]
    ? languageColors[4]
    : value > otherBreaks[1]
    ? languageColors[5]
    : value >= otherBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForOtherAsia(value) {
  return value > otherAsiaBreaks[6]
    ? languageColors[0]
    : value > otherAsiaBreaks[5]
    ? languageColors[1]
    : value > otherAsiaBreaks[4]
    ? languageColors[2]
    : value > otherAsiaBreaks[3]
    ? languageColors[3]
    : value > otherAsiaBreaks[2]
    ? languageColors[4]
    : value > otherAsiaBreaks[1]
    ? languageColors[5]
    : value >= otherAsiaBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForOtherIndo(value) {
  return value > otherIndoBreaks[6]
    ? languageColors[0]
    : value > otherIndoBreaks[5]
    ? languageColors[1]
    : value > otherIndoBreaks[4]
    ? languageColors[2]
    : value > otherIndoBreaks[3]
    ? languageColors[3]
    : value > otherIndoBreaks[2]
    ? languageColors[4]
    : value > otherIndoBreaks[1]
    ? languageColors[5]
    : value >= otherIndoBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForRussian(value) {
  return value > russianBreaks[6]
    ? languageColors[0]
    : value > russianBreaks[5]
    ? languageColors[1]
    : value > russianBreaks[4]
    ? languageColors[2]
    : value > russianBreaks[3]
    ? languageColors[3]
    : value > russianBreaks[2]
    ? languageColors[4]
    : value > russianBreaks[1]
    ? languageColors[5]
    : value >= russianBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForSpanish(value) {
  return value > spanishBreaks[6]
    ? languageColors[0]
    : value > spanishBreaks[5]
    ? languageColors[1]
    : value > spanishBreaks[4]
    ? languageColors[2]
    : value > spanishBreaks[3]
    ? languageColors[3]
    : value > spanishBreaks[2]
    ? languageColors[4]
    : value > spanishBreaks[1]
    ? languageColors[5]
    : value >= spanishBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForTagalog(value) {
  return value > tagalogBreaks[6]
    ? languageColors[0]
    : value > tagalogBreaks[5]
    ? languageColors[1]
    : value > tagalogBreaks[4]
    ? languageColors[2]
    : value > tagalogBreaks[3]
    ? languageColors[3]
    : value > tagalogBreaks[2]
    ? languageColors[4]
    : value > tagalogBreaks[1]
    ? languageColors[5]
    : value >= tagalogBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

function getColorForVietnamese(value) {
  return value > vietnameseBreaks[6]
    ? languageColors[0]
    : value > vietnameseBreaks[5]
    ? languageColors[1]
    : value > vietnameseBreaks[4]
    ? languageColors[2]
    : value > vietnameseBreaks[3]
    ? languageColors[3]
    : value > vietnameseBreaks[2]
    ? languageColors[4]
    : value > vietnameseBreaks[1]
    ? languageColors[5]
    : value >= vietnameseBreaks[0]
    ? languageColors[6]
    : languageColors[7];
}

//=========================================================== DEMOGRAPHIC COLOR FUNCTIONS =================================================================
function getColorScaleForDemographics(population) {
  return population > totalPopBreaks[6]
    ? "#00441b"
    : population > totalPopBreaks[5]
    ? "#006d2c"
    : population > totalPopBreaks[4]
    ? "#238b45"
    : population > totalPopBreaks[3]
    ? "#41ae76"
    : population > totalPopBreaks[2]
    ? "#66c2a4"
    : population > totalPopBreaks[1]
    ? "#99d8c9"
    : population > totalPopBreaks[0]
    ? "#ccece6"
    : "#606060";
}

//=========================================================== HEALTH RISK COLOR FUNCTIONS =================================================================
function getColorForUninsured(percent) {
  return percent > lackOfHealthInsuranceBreaks[6]
    ? healthRiskColors[0]
    : percent > lackOfHealthInsuranceBreaks[5]
    ? healthRiskColors[1]
    : percent > lackOfHealthInsuranceBreaks[4]
    ? healthRiskColors[2]
    : percent > lackOfHealthInsuranceBreaks[3]
    ? healthRiskColors[3]
    : percent > lackOfHealthInsuranceBreaks[2]
    ? healthRiskColors[4]
    : percent > lackOfHealthInsuranceBreaks[1]
    ? healthRiskColors[5]
    : percent > lackOfHealthInsuranceBreaks[0]
    ? healthRiskColors[6]
    : percent > 0
    ? healthRiskColors[7]
    : healthRiskColors[8];
}

function getColorForFrequentDrinkers(percent) {
  return percent > bingeDrinkingBreaks[6]
    ? healthRiskColors[0]
    : percent > bingeDrinkingBreaks[5]
    ? healthRiskColors[1]
    : percent > bingeDrinkingBreaks[4]
    ? healthRiskColors[2]
    : percent > bingeDrinkingBreaks[3]
    ? healthRiskColors[3]
    : percent > bingeDrinkingBreaks[2]
    ? healthRiskColors[4]
    : percent > bingeDrinkingBreaks[1]
    ? healthRiskColors[5]
    : percent > bingeDrinkingBreaks[0]
    ? healthRiskColors[6]
    : percent > 0
    ? healthRiskColors[7]
    : healthRiskColors[8];
}

function getColorForCurrentSmokers(percent) {
  return percent > currentSmokingBreaks[6]
    ? healthRiskColors[0]
    : percent > currentSmokingBreaks[5]
    ? healthRiskColors[1]
    : percent > currentSmokingBreaks[4]
    ? healthRiskColors[2]
    : percent > currentSmokingBreaks[3]
    ? healthRiskColors[3]
    : percent > currentSmokingBreaks[2]
    ? healthRiskColors[4]
    : percent > currentSmokingBreaks[1]
    ? healthRiskColors[5]
    : percent > currentSmokingBreaks[0]
    ? healthRiskColors[6]
    : percent > 0
    ? healthRiskColors[7]
    : healthRiskColors[8];
}

function getColorForSedentaryLifestyle(percent) {
  return percent > physicalInactivityBreaks[6]
    ? healthRiskColors[0]
    : percent > physicalInactivityBreaks[5]
    ? healthRiskColors[1]
    : percent > physicalInactivityBreaks[4]
    ? healthRiskColors[2]
    : percent > physicalInactivityBreaks[3]
    ? healthRiskColors[3]
    : percent > physicalInactivityBreaks[2]
    ? healthRiskColors[4]
    : percent > physicalInactivityBreaks[1]
    ? healthRiskColors[5]
    : percent > physicalInactivityBreaks[0]
    ? healthRiskColors[6]
    : percent > 0
    ? healthRiskColors[7]
    : healthRiskColors[8];
}

function getColorForSleepLessThan7Hours(percent) {
  return percent > sleepLessThan7HoursBreaks[6]
    ? healthRiskColors[0]
    : percent > sleepLessThan7HoursBreaks[5]
    ? healthRiskColors[1]
    : percent > sleepLessThan7HoursBreaks[4]
    ? healthRiskColors[2]
    : percent > sleepLessThan7HoursBreaks[3]
    ? healthRiskColors[3]
    : percent > sleepLessThan7HoursBreaks[2]
    ? healthRiskColors[4]
    : percent > sleepLessThan7HoursBreaks[1]
    ? healthRiskColors[5]
    : percent > sleepLessThan7HoursBreaks[0]
    ? healthRiskColors[6]
    : percent > 0
    ? healthRiskColors[7]
    : healthRiskColors[8];
}

//=========================================================== HEALTH OUTCOMES COLOR FUNCTIONS =================================================================
function getColorForCurrentAsthma(percent) {
  return percent > currentAsthmaBreaks[6]
    ? healthOutcomesColors[0]
    : percent > currentAsthmaBreaks[5]
    ? healthOutcomesColors[1]
    : percent > currentAsthmaBreaks[4]
    ? healthOutcomesColors[2]
    : percent > currentAsthmaBreaks[3]
    ? healthOutcomesColors[3]
    : percent > currentAsthmaBreaks[2]
    ? healthOutcomesColors[4]
    : percent > currentAsthmaBreaks[1]
    ? healthOutcomesColors[5]
    : percent > currentAsthmaBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

function getColorForHighBlood(percent) {
  return percent > highBloodPressureBreaks[6]
    ? healthOutcomesColors[0]
    : percent > highBloodPressureBreaks[5]
    ? healthOutcomesColors[1]
    : percent > highBloodPressureBreaks[4]
    ? healthOutcomesColors[2]
    : percent > highBloodPressureBreaks[3]
    ? healthOutcomesColors[3]
    : percent > highBloodPressureBreaks[2]
    ? healthOutcomesColors[4]
    : percent > highBloodPressureBreaks[1]
    ? healthOutcomesColors[5]
    : percent > highBloodPressureBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

function getColorForCancerAdults(percent) {
  return percent > cancerExceptSkinBreaks[6]
    ? healthOutcomesColors[0]
    : percent > cancerExceptSkinBreaks[5]
    ? healthOutcomesColors[1]
    : percent > cancerExceptSkinBreaks[4]
    ? healthOutcomesColors[2]
    : percent > cancerExceptSkinBreaks[3]
    ? healthOutcomesColors[3]
    : percent > cancerExceptSkinBreaks[2]
    ? healthOutcomesColors[4]
    : percent > cancerExceptSkinBreaks[1]
    ? healthOutcomesColors[5]
    : percent > cancerExceptSkinBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

function getColorForHighCholesterol(percent) {
  return percent > highCholesterolBreaks[6]
    ? healthOutcomesColors[0]
    : percent > highCholesterolBreaks[5]
    ? healthOutcomesColors[1]
    : percent > highCholesterolBreaks[4]
    ? healthOutcomesColors[2]
    : percent > highCholesterolBreaks[3]
    ? healthOutcomesColors[3]
    : percent > highCholesterolBreaks[2]
    ? healthOutcomesColors[4]
    : percent > highCholesterolBreaks[1]
    ? healthOutcomesColors[5]
    : percent > highCholesterolBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

function getColorForKidneyDisease(percent) {
  return percent > chronicKidneyDiseaseBreaks[6]
    ? healthOutcomesColors[0]
    : percent > chronicKidneyDiseaseBreaks[5]
    ? healthOutcomesColors[1]
    : percent > chronicKidneyDiseaseBreaks[4]
    ? healthOutcomesColors[2]
    : percent > chronicKidneyDiseaseBreaks[3]
    ? healthOutcomesColors[3]
    : percent > chronicKidneyDiseaseBreaks[2]
    ? healthOutcomesColors[4]
    : percent > chronicKidneyDiseaseBreaks[1]
    ? healthOutcomesColors[5]
    : percent > chronicKidneyDiseaseBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

function getColorForPulmonaryDisease(percent) {
  return percent > arthritisBreaks[6]
    ? healthOutcomesColors[0]
    : percent > arthritisBreaks[5]
    ? healthOutcomesColors[1]
    : percent > arthritisBreaks[4]
    ? healthOutcomesColors[2]
    : percent > arthritisBreaks[3]
    ? healthOutcomesColors[3]
    : percent > arthritisBreaks[2]
    ? healthOutcomesColors[4]
    : percent > arthritisBreaks[1]
    ? healthOutcomesColors[5]
    : percent > arthritisBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

function getColorForHeartDisease(percent) {
  return percent > coronaryHeartDiseaseBreaks[6]
    ? healthOutcomesColors[0]
    : percent > coronaryHeartDiseaseBreaks[5]
    ? healthOutcomesColors[1]
    : percent > coronaryHeartDiseaseBreaks[4]
    ? healthOutcomesColors[2]
    : percent > coronaryHeartDiseaseBreaks[3]
    ? healthOutcomesColors[3]
    : percent > coronaryHeartDiseaseBreaks[2]
    ? healthOutcomesColors[4]
    : percent > coronaryHeartDiseaseBreaks[1]
    ? healthOutcomesColors[5]
    : percent > coronaryHeartDiseaseBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

function getColorForDiabetes(percent) {
  return percent > diabetesBreaks[6]
    ? healthOutcomesColors[0]
    : percent > diabetesBreaks[5]
    ? healthOutcomesColors[1]
    : percent > diabetesBreaks[4]
    ? healthOutcomesColors[2]
    : percent > diabetesBreaks[3]
    ? healthOutcomesColors[3]
    : percent > diabetesBreaks[2]
    ? healthOutcomesColors[4]
    : percent > diabetesBreaks[1]
    ? healthOutcomesColors[5]
    : percent > diabetesBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

function getColorForObesity(percent) {
  return percent > obesityBreaks[6]
    ? healthOutcomesColors[0]
    : percent > obesityBreaks[5]
    ? healthOutcomesColors[1]
    : percent > obesityBreaks[4]
    ? healthOutcomesColors[2]
    : percent > obesityBreaks[3]
    ? healthOutcomesColors[3]
    : percent > obesityBreaks[2]
    ? healthOutcomesColors[4]
    : percent > obesityBreaks[1]
    ? healthOutcomesColors[5]
    : percent > obesityBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

function getColorForStroke(percent) {
  return percent > strokeBreaks[6]
    ? healthOutcomesColors[0]
    : percent > strokeBreaks[5]
    ? healthOutcomesColors[1]
    : percent > strokeBreaks[4]
    ? healthOutcomesColors[2]
    : percent > strokeBreaks[3]
    ? healthOutcomesColors[3]
    : percent > strokeBreaks[2]
    ? healthOutcomesColors[4]
    : percent > strokeBreaks[1]
    ? healthOutcomesColors[5]
    : percent > strokeBreaks[0]
    ? healthOutcomesColors[6]
    : percent > 0
    ? healthOutcomesColors[7]
    : healthOutcomesColors[8];
}

//=========================================================== SCREENING RATES COLOR FUNCTIONS =================================================================
function getColorForAnnualCheckUp(percent) {
  return percent > annualCheckupBreaks[6]
    ? screeningRatesColors[0]
    : percent > annualCheckupBreaks[5]
    ? screeningRatesColors[1]
    : percent > annualCheckupBreaks[4]
    ? screeningRatesColors[2]
    : percent > annualCheckupBreaks[3]
    ? screeningRatesColors[3]
    : percent > annualCheckupBreaks[2]
    ? screeningRatesColors[4]
    : percent > annualCheckupBreaks[1]
    ? screeningRatesColors[5]
    : percent > annualCheckupBreaks[0]
    ? screeningRatesColors[6]
    : percent > 0
    ? screeningRatesColors[7]
    : screeningRatesColors[8];
}

function getColorForDentalVisit(percent) {
  return percent > dentalVisitBreaks[6]
    ? screeningRatesColors[0]
    : percent > dentalVisitBreaks[5]
    ? screeningRatesColors[1]
    : percent > dentalVisitBreaks[4]
    ? screeningRatesColors[2]
    : percent > dentalVisitBreaks[3]
    ? screeningRatesColors[3]
    : percent > dentalVisitBreaks[2]
    ? screeningRatesColors[4]
    : percent > dentalVisitBreaks[1]
    ? screeningRatesColors[5]
    : percent > dentalVisitBreaks[0]
    ? screeningRatesColors[6]
    : percent > 0
    ? screeningRatesColors[7]
    : screeningRatesColors[8];
}

function getColorForCholesterolScreening(percent) {
  return percent > cholesterolScreeningBreaks[6]
    ? screeningRatesColors[0]
    : percent > cholesterolScreeningBreaks[5]
    ? screeningRatesColors[1]
    : percent > cholesterolScreeningBreaks[4]
    ? screeningRatesColors[2]
    : percent > cholesterolScreeningBreaks[3]
    ? screeningRatesColors[3]
    : percent > cholesterolScreeningBreaks[2]
    ? screeningRatesColors[4]
    : percent > cholesterolScreeningBreaks[1]
    ? screeningRatesColors[5]
    : percent > cholesterolScreeningBreaks[0]
    ? screeningRatesColors[6]
    : percent > 0
    ? screeningRatesColors[7]
    : screeningRatesColors[8];
}

function getColorForMammographyScreening(percent) {
  return percent > mammographyUseBreaks[6]
    ? screeningRatesColors[0]
    : percent > mammographyUseBreaks[5]
    ? screeningRatesColors[1]
    : percent > mammographyUseBreaks[4]
    ? screeningRatesColors[2]
    : percent > mammographyUseBreaks[3]
    ? screeningRatesColors[3]
    : percent > mammographyUseBreaks[2]
    ? screeningRatesColors[4]
    : percent > mammographyUseBreaks[1]
    ? screeningRatesColors[5]
    : percent > mammographyUseBreaks[0]
    ? screeningRatesColors[6]
    : percent > 0
    ? screeningRatesColors[7]
    : screeningRatesColors[8];
}

function getColorForCervicalScreening(percent) {
  return percent > cervicalCancerScreeningBreaks[6]
    ? screeningRatesColors[0]
    : percent > cervicalCancerScreeningBreaks[5]
    ? screeningRatesColors[1]
    : percent > cervicalCancerScreeningBreaks[4]
    ? screeningRatesColors[2]
    : percent > cervicalCancerScreeningBreaks[3]
    ? screeningRatesColors[3]
    : percent > cervicalCancerScreeningBreaks[2]
    ? screeningRatesColors[4]
    : percent > cervicalCancerScreeningBreaks[1]
    ? screeningRatesColors[5]
    : percent > cervicalCancerScreeningBreaks[0]
    ? screeningRatesColors[6]
    : percent > 0
    ? screeningRatesColors[7]
    : screeningRatesColors[8];
}

function getColorForColorectalScreening(percent) {
  return percent > colorectalCancerScreeningBreaks[6]
    ? screeningRatesColors[0]
    : percent > colorectalCancerScreeningBreaks[5]
    ? screeningRatesColors[1]
    : percent > colorectalCancerScreeningBreaks[4]
    ? screeningRatesColors[2]
    : percent > colorectalCancerScreeningBreaks[3]
    ? screeningRatesColors[3]
    : percent > colorectalCancerScreeningBreaks[2]
    ? screeningRatesColors[4]
    : percent > colorectalCancerScreeningBreaks[1]
    ? screeningRatesColors[5]
    : percent > colorectalCancerScreeningBreaks[0]
    ? screeningRatesColors[6]
    : percent > 0
    ? screeningRatesColors[7]
    : screeningRatesColors[8];
}

//=========================================================== HEALTH STATUS COLOR FUNCTIONS =================================================================
function getColorForDepression(percent) {
  return percent > depressionBreaks[6]
    ? healthStatusColors[0]
    : percent > depressionBreaks[5]
    ? healthStatusColors[1]
    : percent > depressionBreaks[4]
    ? healthStatusColors[2]
    : percent > depressionBreaks[3]
    ? healthStatusColors[3]
    : percent > depressionBreaks[2]
    ? healthStatusColors[4]
    : percent > depressionBreaks[1]
    ? healthStatusColors[5]
    : percent > depressionBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForMentalHealthBad(percent) {
  return percent > frequentMentalHealthDistressBreaks[6]
    ? healthStatusColors[0]
    : percent > frequentMentalHealthDistressBreaks[5]
    ? healthStatusColors[1]
    : percent > frequentMentalHealthDistressBreaks[4]
    ? healthStatusColors[2]
    : percent > frequentMentalHealthDistressBreaks[3]
    ? healthStatusColors[3]
    : percent > frequentMentalHealthDistressBreaks[2]
    ? healthStatusColors[4]
    : percent > frequentMentalHealthDistressBreaks[1]
    ? healthStatusColors[5]
    : percent > frequentMentalHealthDistressBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForPhysicalHealthBad(percent) {
  return percent > frequentPhysicalHealthDistressBreaks[6]
    ? healthStatusColors[0]
    : percent > frequentPhysicalHealthDistressBreaks[5]
    ? healthStatusColors[1]
    : percent > frequentPhysicalHealthDistressBreaks[4]
    ? healthStatusColors[2]
    : percent > frequentPhysicalHealthDistressBreaks[3]
    ? healthStatusColors[3]
    : percent > frequentPhysicalHealthDistressBreaks[2]
    ? healthStatusColors[4]
    : percent > frequentPhysicalHealthDistressBreaks[1]
    ? healthStatusColors[5]
    : percent > frequentPhysicalHealthDistressBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForPoorSelfRatedHealth(percent) {
  return percent > fairOrPoorHealthBreaks[6]
    ? healthStatusColors[0]
    : percent > fairOrPoorHealthBreaks[5]
    ? healthStatusColors[1]
    : percent > fairOrPoorHealthBreaks[4]
    ? healthStatusColors[2]
    : percent > fairOrPoorHealthBreaks[3]
    ? healthStatusColors[3]
    : percent > fairOrPoorHealthBreaks[2]
    ? healthStatusColors[4]
    : percent > fairOrPoorHealthBreaks[1]
    ? healthStatusColors[5]
    : percent > fairOrPoorHealthBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForDisability(percent) {
  return percent > anyDisabilityBreaks[6]
    ? healthStatusColors[0]
    : percent > anyDisabilityBreaks[5]
    ? healthStatusColors[1]
    : percent > anyDisabilityBreaks[4]
    ? healthStatusColors[2]
    : percent > anyDisabilityBreaks[3]
    ? healthStatusColors[3]
    : percent > anyDisabilityBreaks[2]
    ? healthStatusColors[4]
    : percent > anyDisabilityBreaks[1]
    ? healthStatusColors[5]
    : percent > anyDisabilityBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForHearingDisability(percent) {
  return percent > hearingDisabilityBreaks[6]
    ? healthStatusColors[0]
    : percent > hearingDisabilityBreaks[5]
    ? healthStatusColors[1]
    : percent > hearingDisabilityBreaks[4]
    ? healthStatusColors[2]
    : percent > hearingDisabilityBreaks[3]
    ? healthStatusColors[3]
    : percent > hearingDisabilityBreaks[2]
    ? healthStatusColors[4]
    : percent > hearingDisabilityBreaks[1]
    ? healthStatusColors[5]
    : percent > hearingDisabilityBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForVisionDisability(percent) {
  return percent > visionDisabilityBreaks[6]
    ? healthStatusColors[0]
    : percent > visionDisabilityBreaks[5]
    ? healthStatusColors[1]
    : percent > visionDisabilityBreaks[4]
    ? healthStatusColors[2]
    : percent > visionDisabilityBreaks[3]
    ? healthStatusColors[3]
    : percent > visionDisabilityBreaks[2]
    ? healthStatusColors[4]
    : percent > visionDisabilityBreaks[1]
    ? healthStatusColors[5]
    : percent > visionDisabilityBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForCognitiveDisability(percent) {
  return percent > cognitiveDisabilityBreaks[6]
    ? healthStatusColors[0]
    : percent > cognitiveDisabilityBreaks[5]
    ? healthStatusColors[1]
    : percent > cognitiveDisabilityBreaks[4]
    ? healthStatusColors[2]
    : percent > cognitiveDisabilityBreaks[3]
    ? healthStatusColors[3]
    : percent > cognitiveDisabilityBreaks[2]
    ? healthStatusColors[4]
    : percent > cognitiveDisabilityBreaks[1]
    ? healthStatusColors[5]
    : percent > cognitiveDisabilityBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForMobilityDisability(percent) {
  return percent > mobilityDisabilityBreaks[6]
    ? healthStatusColors[0]
    : percent > mobilityDisabilityBreaks[5]
    ? healthStatusColors[1]
    : percent > mobilityDisabilityBreaks[4]
    ? healthStatusColors[2]
    : percent > mobilityDisabilityBreaks[3]
    ? healthStatusColors[3]
    : percent > mobilityDisabilityBreaks[2]
    ? healthStatusColors[4]
    : percent > mobilityDisabilityBreaks[1]
    ? healthStatusColors[5]
    : percent > mobilityDisabilityBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForSelfCareDisability(percent) {
  return percent > selfCareDisabilityBreaks[6]
    ? healthStatusColors[0]
    : percent > selfCareDisabilityBreaks[5]
    ? healthStatusColors[1]
    : percent > selfCareDisabilityBreaks[4]
    ? healthStatusColors[2]
    : percent > selfCareDisabilityBreaks[3]
    ? healthStatusColors[3]
    : percent > selfCareDisabilityBreaks[2]
    ? healthStatusColors[4]
    : percent > selfCareDisabilityBreaks[1]
    ? healthStatusColors[5]
    : percent > selfCareDisabilityBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

function getColorForIndependentLivingDisability(percent) {
  return percent > independentLivingDisabilityBreaks[6]
    ? healthStatusColors[0]
    : percent > independentLivingDisabilityBreaks[5]
    ? healthStatusColors[1]
    : percent > independentLivingDisabilityBreaks[4]
    ? healthStatusColors[2]
    : percent > independentLivingDisabilityBreaks[3]
    ? healthStatusColors[3]
    : percent > independentLivingDisabilityBreaks[2]
    ? healthStatusColors[4]
    : percent > independentLivingDisabilityBreaks[1]
    ? healthStatusColors[5]
    : percent > independentLivingDisabilityBreaks[0]
    ? healthStatusColors[6]
    : percent > 0
    ? healthStatusColors[7]
    : healthStatusColors[8];
}

/* SYNCHRONIZE MAPS */

maps["demographicLanguageMap"].sync(maps["healthRiskBehaviorsMap"]);
maps["demographicLanguageMap"].sync(maps["healthOutcomesMap"]);
maps["demographicLanguageMap"].sync(maps["screeningRatesMap"]);
maps["demographicLanguageMap"].sync(maps["healthStatusMap"]);

maps["healthRiskBehaviorsMap"].sync(maps["demographicLanguageMap"]);
maps["healthRiskBehaviorsMap"].sync(maps["healthOutcomesMap"]);
maps["healthRiskBehaviorsMap"].sync(maps["screeningRatesMap"]);
maps["healthRiskBehaviorsMap"].sync(maps["healthStatusMap"]);

maps["healthOutcomesMap"].sync(maps["demographicLanguageMap"]);
maps["healthOutcomesMap"].sync(maps["healthRiskBehaviorsMap"]);
maps["healthOutcomesMap"].sync(maps["screeningRatesMap"]);
maps["healthOutcomesMap"].sync(maps["healthStatusMap"]);

maps["screeningRatesMap"].sync(maps["demographicLanguageMap"]);
maps["screeningRatesMap"].sync(maps["healthRiskBehaviorsMap"]);
maps["screeningRatesMap"].sync(maps["healthOutcomesMap"]);
maps["screeningRatesMap"].sync(maps["healthStatusMap"]);

maps["healthStatusMap"].sync(maps["demographicLanguageMap"]);
maps["healthStatusMap"].sync(maps["healthRiskBehaviorsMap"]);
maps["healthStatusMap"].sync(maps["healthOutcomesMap"]);
maps["healthStatusMap"].sync(maps["screeningRatesMap"]);
