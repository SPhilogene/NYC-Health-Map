// MAP BOUNDS - set bounds so the map has limits for visibility 
var southWest = L.latLng(40.567, -74.054),
    northEast = L.latLng(40.806, -73.861),
    bounds = L.latLngBounds(southWest, northEast);

// MAP OBJECT
var mymap = L.map('mapid', {
    maxBounds: bounds, // Map automatically bounces back to center
    maxZoom: 18,
    minZoom: 12
}).setView([40.65, -73.97], 12);

// BASEMAP
var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2hlZW5hcCIsImEiOiJja25hdXE3aGcxbGI4MnVxbnFoenhwdGRrIn0.DhFwD-KlRigYLaVwL8ipGA'
}).addTo(mymap);

var zipGroup = new L.layerGroup(); //
var ntaGroup = new L.layerGroup(); //
var pumaGroup = new L.layerGroup(); //
var annualCheckHood = new Array(); //
var cervicalScreenZip = new Array(); // TEAL
var ColorectalScreenZip = new Array(); // NAVY BLUE
var MammographZip = new Array(); // PINK
var cancerZip = new Array(); //
var unInsuredZip = new Array(); //
var smokersZip = new Array(); //
var bingeDrinkers = new Array(); //
var obeseZip = new Array(); //
var inactiveZip = new Array(); //
var asthmaZip = new Array(); //
var kidneyZip = new Array(); //
var sleeplessZip = new Array(); //
var diabeticZip = new Array(); //
var zipData = new Array(); //
var displayData;
var zipSelected;
var zipOutlines;

//=========================================================== LANGUAGE LAYERS =================================================================

var languageGroup = new L.featureGroup();
// homeLanguage LAYER ADD
var languageLayer =  L.geoJson(null, {
    style: style,
    onEachFeature: function(feature, layer) {

        //ADD LANGUAGE POP UP
        layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
            ')</h5> <p>Approximately <strong>' + (feature.properties.TotalPop).toLocaleString('en', {maximumFractionDigits:0})   +
            '</strong> people live in ' + feature.properties.TractName + ', and around <strong>' + feature.properties.Multi + '%</strong> of these residents speak a language other than English. <br><br> The predominant non-English spoken language is: <strong>' + feature.properties.Predominan + '</strong></p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001<br> <i>2014-2018 - Language Spoken at Home</i> </p>');

        // ADD MOUSEOVER 
        layer.on('mouseover', function() {
            layer.setStyle({
                fillOpacity: 0.3
            })
        })
        layer.on('mouseout', function() {
            layer.setStyle({
                fillOpacity: 0.8
            })
        });
    }
    }).addTo(languageGroup);

$.getJSON("Brooklyn_Language.geojson", function(data) {
    languageLayer.addData(data);
});

languageGroup.addTo(mymap)

// LANGUAGE LEGEND
var languageLegend = L.control({
    position: "bottomleft"
});
languageLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Predominant Languages</h4>";
    div.innerHTML += '<i style="background: #ccb8cbff"></i><span>African languages</span><br>';
    div.innerHTML += '<i style="background: #fa9993ff"></i><span>Arabic</span><br>';
    div.innerHTML += '<i style="background: #963f92ff"></i><span>Chinese</span><br>';
    div.innerHTML += '<i style="background: #6b5b95"></i><span>French</span><br>';
    div.innerHTML += '<i style="background: #f7d9b6ff"></i><span>Greek</span><br>';
    div.innerHTML += '<i style="background: #30bfc7ff"></i><span>Haitian Creole</span><br>';
    div.innerHTML += '<i style="background: #eb554dff"></i><span>Hebrew</span><br>';
    div.innerHTML += '<i style="background: #c7e9b4"></i><span>Italian</span><br>';
    div.innerHTML += '<i style="background: #91c1fdff"></i><span>Mixed Indic languages</span><br>';
    div.innerHTML += '<i style="background: #51eba6ff"></i><span>Polish</span><br>';
    div.innerHTML += '<i style="background: #e28513ff"></i><span>Russian</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>Spanish</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>Urdu</span><br>';
    div.innerHTML += '<i style="background: #3288bd"></i><span>Yiddish</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}
languageLegend.addTo(mymap);

function getColor(d) {
    return d == "African languages" ? '#ccb8cbff' :
        d == "Arabic" ? '#fa9993ff' :
        d == "Chinese" ? '#963f92ff' :
        d == "French" ? '#6b5b95' :
        d == "Greek" ? '#f7d9b6ff' :
        d == "Haitian Creole" ? '#30bfc7ff' :
        d == "Hebrew" ? '#eb554dff' :
        d == "Italian" ? '#c7e9b4' :
        d == "Mixed Indic languages" ? '#91c1fdff' :
        d == "Polish" ? '#51eba6ff' :
        d == "Russian" ? '#e28513ff' :
        d == "Spanish" ? '#41ab5d' :
        d == "Urdu" ? '#e7298a' :
        d == "Yiddish" ? '#3288bd' :
        '#606060';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.Predominan),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    };
}



//=========================================================== PUMA OVERLAY =================================================================
var pumaGroup = new L.layerGroup();

mymap.createPane("pane650").style.zIndex = 650;

var pumaLayer = L.geoJson(null, {
    pane: "pane650",
    style: {
        "color": "#fff",
        "weight": 5,
        "opacity": 0.65
    },
    //ADD POP UP
    onEachFeature: function(feature, layer) {
        layer.bindPopup('PUMA: ' + feature.properties.PUMA);
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
        // ADD LABELS
        if (feature.geometry.type === 'Polygon' || 'MultiPolygon') {
            label = String(feature.properties.PUMA) 
            var centroid = turf.centroid(feature);
            var lon = centroid.geometry.coordinates[0];
            var lat = centroid.geometry.coordinates[1];
            return new L.CircleMarker([lat,lon]).bindTooltip(label, {permanent: true, opacity: 1, direction:'center'}).openTooltip().addTo(pumaGroup);
        }
        }
    }).addTo(pumaGroup)

$.getJSON("PUMA.geojson", function(data) {
    pumaLayer.addData(data);
    //pumaLabels.addData(data);
});

    


//=========================================================== NTA OVERLAY =================================================================
var ntaGroup = new L.layerGroup();

mymap.createPane("pane650").style.zIndex = 650;

var ntaLayer = L.geoJson(null, {
    pane: "pane650",
    style: {
        "color": "#ffffff",
        "weight": 5,
        "opacity": 0.65 },
        //ADD POP UP
    onEachFeature: function(feature, layer) {
        layer.bindPopup('NTA code: ' + feature.properties.NTACode + ' | NTA name: ' + feature.properties.NTAName);
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
        //ADD LABELS
        if (feature.geometry.type === 'Polygon' || 'MultiPolygon') {
            label = String(feature.properties.NTACode) 
            var centroid = turf.centroid(feature);
            var lon = centroid.geometry.coordinates[0];
            var lat = centroid.geometry.coordinates[1];
            return new L.CircleMarker([lat,lon]).bindTooltip(label, {permanent: true, opacity: 1, direction:'center'}).openTooltip().addTo(ntaGroup);
        }
    }
    }).addTo(ntaGroup)

$.getJSON("NTA.geojson", function(data) {
    ntaLayer.addData(data);
    //ntaLabels.addData(data);
});


//=========================================================== PLACES ZIP CODE LEVEL =================================================================
var zipGroup = new L.layerGroup();

mymap.createPane("pane650").style.zIndex = 650;

var placesZipLayer = L.geoJson(null, {
    pane: "pane650",
        style: {
    "color": "#fff",
    "weight": 5,
    "opacity": 0.65
},
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3> Zip code: ' + feature.properties.Zip + '</h3> <p>The estimated total population of people living in <strong>' + feature.properties.Zip + ' (' + feature.properties.Hood + ') ' +
                '</strong> is <strong>' + (feature.properties.Total_popu).toLocaleString('en', {maximumFractionDigits:0}) + '</strong>.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
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
            //ADD LABEL
            if (feature.geometry.type === 'Polygon') {
            label = String(feature.properties.Zip) 
            var centroid = turf.centroid(feature);
            var lon = centroid.geometry.coordinates[0];
            var lat = centroid.geometry.coordinates[1];
            return new L.CircleMarker([lat,lon]).bindTooltip(label, {permanent: true, opacity: 1, direction:'center'}).openTooltip().addTo(zipGroup);
            }
        }
    }).addTo(zipGroup)

$.getJSON("ZIP_CODE.geojson", function(data) {
    placesZipLayer.addData(data);


//=========================================================== ZIP CODE AGGREGATE =================================================================


//
var codes = new Array(); //ordered zip codes empty array
// ADD DATA IN XY PAIRS FOR CHART
    data.features.forEach(function(feature) {
        // COLLECT NEIGHBORHOOD CHART DATA 
        cancerZip.push([feature.properties.Hood, feature.properties.Ncancer]);
        cervicalScreenZip.push([feature.properties.Hood, feature.properties.Ncervical]);
        ColorectalScreenZip.push([feature.properties.Hood, feature.properties.Ncolorecta]);
        MammographZip.push([feature.properties.Hood, feature.properties.Nmammogr]);
        smokersZip.push([feature.properties.Hood, feature.properties.Nsmoker]);
        bingeDrinkers.push([feature.properties.Hood, feature.properties.Ndrink]);
        obeseZip.push([feature.properties.Hood, feature.properties.Nobese]);
        inactiveZip.push([feature.properties.Hood, feature.properties.Ninactive]);
        unInsuredZip.push([feature.properties.Hood, feature.properties.Nuninsured]);
        annualCheckHood.push([feature.properties.Hood, feature.properties.Nannual]);
        asthmaZip.push([feature.properties.Hood, feature.properties.Nasthma]);
        kidneyZip.push([feature.properties.Hood, feature.properties.Nkidney]);
        sleeplessZip.push([feature.properties.Hood, feature.properties.Nannual]);
        diabeticZip.push([feature.properties.Hood, feature.properties.Ndiabetic]);

// TEXT TO RETURN WITH ZIP CODE SELECTOR 
zipData.push([
feature.properties.Zip, '<h4 style="text-align: center"><strong>'+feature.properties.Zip  +'</strong></h4> <p>Neighborhood: ' +feature.properties.Hood  +'<br>Estimated Population: ' +(feature.properties.Total_popu).toLocaleString('en', {maximumFractionDigits:0})    +'</p><h5><strong>Language Statistics</strong></h5> <li>Speakers of one or more language other than English: ' +feature.properties.P_bilingua  +'%</li><li>Non-English fluent: ' +feature.properties.P_nonFluen  +'%</li> <li>Most commonly spoken non-English language: <span class='+feature.properties.Predominan+'> ' +feature.properties.Predominan  +'</span></li><br> <h5><strong>Health Statistics</strong></h5> <li>Uninsured: ' +feature.properties.UNINSURED  +'%</li><h6 style="line-height: 0.4;margin-bottom: 5px;margin-top: 10px;"><i style="font-size: 13px;line-height: 0px;letter-spacing: 0.069em;font-weight: 600; font-style: normal;">Health Outcomes</i></h6><li>Cancer prevelance '+feature.properties.CANCER  + '%</li><li>Chronic kidney disease: ' +feature.properties.KIDNEY  +'%</li> <li>Asthma: ' +feature.properties.ASTHMA  +'%</li><li>Diabetes: ' +feature.properties.DIABETES  +'%</li>  <li>Obesity (<i>BMI ≥ 30</i>): ' +feature.properties.OBESITY  +'%</li><h6 style="line-height: 0.4;margin-bottom: 5px;margin-top: 10px;"><i style="font-size: 13px;line-height: 0px;letter-spacing: 0.069em;font-weight: 600; font-style: normal;">Unhealthy Behaviors</i></h6><li>Smokers: ' +feature.properties.SMOKING  +'%</li> <li>Binge drinkers: ' +feature.properties.DRINK  +'%</li> <li>Do not participate in physical activities or exercises: ' +feature.properties.INACTIVE  +'%</li><li>Typically sleep fewer than 7 hours per night: ' +feature.properties.SLEEPLESS  +'%</li><h6 style="line-height: 0.4;margin-bottom: 5px;margin-top: 10px;"><i style="font-size: 13px;line-height: 0px;letter-spacing: 0.069em;font-weight: 600; font-style: normal;">Screening Rates</i></h6><li>Recent check up with primary care physician: ' +feature.properties.CHECKUP  +'%</li> <li>Recent colorectal cancer screening: ' +feature.properties.COLORECTAL  +'%</li> <li>Recent cervical cancer screening: ' +feature.properties.CERVICAL  +'%</li> <li>Recent visit to a dentist or dental clinic: ' +feature.properties.DENTAL  +'%</li> <li>Recent mammography scereening (<i>women aged 50-74 years</i>): ' +feature.properties.MAMMO  +'%</li>'
]);

        // SORT ZIP CODES FOR DROPDOWN
        codes.push(feature.properties.Zip);
        codes.sort();
    });

    // ORDERED ZIP CODES FOR DROPDOWN && EXCLUDE 11249 WHICH HAS NO HEALTH DATA
    codes.forEach(function(zip) {
        if (zip !== 11249) { //no health data available for 11249
        $('#zipCodes').append('<option value "' + zip + '">' + zip + '</option>');
        }
    });


    // ON CHANGING ZIP CODE
$(document).ready(function(){
  $('#zipCodes').on('change',function(){
  zipSelected = $("#zipCodes option:selected").text();
//console.log(zipSelected)
// MATCH zipData AND RETURN APPROPRIATE TEXT

  for( var i = 0; i < 99; i++ ) {
    if( zipData[i][0] == zipSelected ) {
        document.getElementById("mapContainer1").innerHTML = zipData[i][1];
        highLight(zipSelected)
        break;
    } 
    else {
        document.getElementById("mapContainer1").innerHTML = '<br><br><h3 style= "text-align:center">Select a new zip code</h3><br><h3 style= "text-align:center"><i>or</i></h3><br><h5 style="text-align:center">Check out the charts below to see an overview of the health statistics on a neighborhood level.</h5><br><h4 style= "text-align:center"><i class="fa fa-arrow-down" aria-hidden="true"></i><h4><br><h5 style= "text-align:center"><i class="fa fa-arrow-down" aria-hidden="true"></i></h5><br><br><h6 style= "text-align:center"><i class="fa fa-arrow-down" aria-hidden="true"></i></h6>';
    }
  }
});
});

// NEIGHBORHOOD LEVEL CHARTS

    $('#CHART_screening').highcharts({
        chart: {
            type: "column"
        },
        title: {
            text: "Percentage of Health Screenings by Neighborhood"
        },
        xAxis: {
            type: 'category',
            allowDecimals: false,
            title: {
                text: ""
            }
        },
        yAxis: {
            title: {
                text: "Percentage (%)"
            }
        },
                tooltip:{
  enabled: true,
  pointFormat: '{series.name}: <b>{point.y}{point.percentage:.1f}%</b>'
  },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    rotation: 270,
                    align: 'top',
                    //x: 10,
                    y: -5,
                    crop: true,
                    overflow: "none",
                    verticalAlign: 'top',
                    style: {
                        color: 'black',
                        font: '11px Arial, sans-serif',
                        //fontWeight: 'normal',
                    },
                    pointFormat: '{point.y}{point.percentage:.1f}%'
                }
            }
        },
        series: [{
            name: 'Colorectal Cancer Screening',
            data: ColorectalScreenZip,
            color: '#00008b'
        }, {

            name: 'Cervical Cancer Screening',
            data: cervicalScreenZip,
            color: '#008080'
        }, {

            name: 'Mammography Screening',
            data: MammographZip,
            color: '#ffc0cb'
        }, {
            name: 'Annual Check Up',
            data: annualCheckHood,
            color: '#c0dcec'
        }]
    }); 


    $('#CHART_behavior').highcharts({
        chart: {
            type: "column"
        },
        title: {
            text: "Percentage of Unhealthy Behaviors by Neighborhood"
        },
        xAxis: {
            type: 'category',
            allowDecimals: false,
            title: {
                text: ""
            }
        },
        yAxis: {
            title: {
                text: "Percentage (%)"
            }
        },
                tooltip:{
  enabled: true,
  pointFormat: '{series.name}: <b>{point.y}{point.percentage:.1f}%</b>'
  },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    rotation: 270,
                    align: 'top',
                    //x: 10,
                    y: -5,
                    crop: true,
                    overflow: "none",
                    verticalAlign: 'top',
                    style: {
                        color: 'black',
                        font: '10px Arial, sans-serif',
                        //fontWeight: 'normal',
                    },
                    pointFormat: '{point.y}{point.percentage:.1f}%'
                }
            }
        },
        series: [{
            name: 'Uninsured',
            data: unInsuredZip,
            color: '#f1ced4'
        }, {
            name: 'Current Smokers',
            data: smokersZip,
            color: '#808080'
        }, {
            name: 'Binge Drinkers',
            data: bingeDrinkers,
            color: '#d8ddb8'
        }, {
            name: 'Obesity',
            data: obeseZip,
            color: '#e0ac8e'
        }, {
            name: 'Physical Inactivity',
            data: inactiveZip,
            color: '#6d3d38'
        }]
    });


    $('#CHART_health').highcharts({
        chart: {
            type: "column"
        },
        title: {
            text: "Percentage of Health Outcomes by Neighborhood"
        },
        xAxis: {
            type: 'category',
            allowDecimals: false,
            title: {
                text: ""
            }
        },
        yAxis: {
            title: {
                text: "Percentage (%)"
            }
        },
                tooltip:{
  enabled: true,
  pointFormat: '{series.name}: <b>{point.y}{point.percentage:.1f}%</b>'
  },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    align: 'top',
                    //x: 10,
                    y: -5,
                    crop: true,
                    overflow: "none",
                    verticalAlign: 'top',
                    style: {
                        color: 'black',
                        font: '11px Arial, sans-serif',
                        //fontWeight: 'normal',
                    },
                    pointFormat: '{point.y}{point.percentage:.1f}%'
                }
            }
        },
        series: [{
            name: 'Chronic Kidney Disease',
            data: kidneyZip,
            color: '#228b22'
        }, {
            name: 'Overall Cancer Prevelance',
            data: cancerZip,
            color: '#b394c1'
        }, {
            name: 'Asthma',
            data: asthmaZip,
            color: '#c0c0c0'
        }, {
            name: 'Diabetic',
            data: diabeticZip,
            color: '#db7093'
        }]
    });

});

//=========================================================== PLACES TRACT LEVEL =================================================================

//   OUTCOMES ---- 

//CANCER
var cancerLayer =  L.geoJson(null, {
        style: styleCancer,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract, and the estimated prevalence rate of cancer (excluding skin cancer) among adults, 18 years and older, is: <strong>' + feature.properties.CANCER + '%</strong>. </p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var cancerLegend = L.control({
    position: "bottomleft"
});
cancerLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Cancer Prevelance</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>for all types but skin</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>9.8% - 15%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>7.8% - 9.8%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>6.6% - 7.8%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>5.7% - 6.6%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>4.9% - 5.7%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>4.1% - 4.9%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 4.1%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorCancer(percent) {
    return percent > 9.8 ?
        "#91003f" :
        percent > 7.8 ?
        "#ce1256" :
        percent > 6.6 ?
        "#e7298a" :
        percent > 5.7 ?
        "#df65b0" :
        percent > 4.9 ?
        "#c994c7" :
        percent > 4.1 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleCancer(feature) {
    return {
        fillColor: colorCancer(feature.properties.CANCER),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//High_blood

var bloodPressureLayer =  L.geoJson(null, {
        style: styleBP,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.High_blood + '%</strong> of residents have high blood pressure.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var bpLegend = L.control({
    position: "bottomleft"
});
bpLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>High Blood Pressure</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>46.3% - 57.6%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>35.5% - 46.3%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>31.1% - 35.5%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>27.5% - 31.1%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>23.7% - 27.5%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>19.1% - 23.7%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 19.1%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorBP(percent) {
    return percent > 46.3 ?
        "#91003f" :
        percent > 35.5 ?
        "#ce1256" :
        percent > 31.1 ?
        "#e7298a" :
        percent > 27.5 ?
        "#df65b0" :
        percent > 23.7 ?
        "#c994c7" :
        percent > 19.1 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleBP(feature) {
    return {
        fillColor: colorBP(feature.properties.High_blood),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//ASTHMA 

var asthmaLayer =  L.geoJson(null, {
        style: styleAsthma,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.ASTHMA + '%</strong> of residents have asthma.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var asthmaLegend = L.control({
    position: "bottomleft"
});
asthmaLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Asthma Prevalence</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>13.4% - 16%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>12.2% - 13.4%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>11.3% - 12.2%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>10.4% - 11.3%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>9.4% - 10.4%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>8.6% - 9.4%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 8.6%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorAsthma(percent) {
    return percent > 13.4 ?
        "#91003f" :
        percent > 12.2 ?
        "#ce1256" :
        percent > 11.3 ?
        "#e7298a" :
        percent > 10.4 ?
        "#df65b0" :
        percent > 9.4 ?
        "#c994c7" :
        percent > 8.6 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleAsthma(feature) {
    return {
        fillColor: colorAsthma(feature.properties.ASTHMA),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//Coronary_h 

var heartDiseaseLayer =  L.geoJson(null, {
        style: styleHeart,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.Coronary_h + '%</strong> of residents have had angina or coronary heart disease.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var heartLegend = L.control({
    position: "bottomleft"
});
heartLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Coronary Heart Disease</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>16% - 26.7%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>10.5% - 16%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>7.6% - 10.5%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>6.1% - 7.6%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>5% - 6.1%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>3.8% - 5%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 3.8%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorHeart(percent) {
    return percent > 16 ?
        "#91003f" :
        percent > 10.5 ?
        "#ce1256" :
        percent > 7.6 ?
        "#e7298a" :
        percent > 6.1 ?
        "#df65b0" :
        percent > 5 ?
        "#c994c7" :
        percent > 3.8 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleHeart(feature) {
    return {
        fillColor: colorHeart(feature.properties.Coronary_h),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//DIABETES
var diabetesLayer =  L.geoJson(null, {
        style: styleDiabetes,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.DIABETES + '%</strong> of residents have diabetes (excluding diabetes during pregnancy).</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var diabetesLegend = L.control({
    position: "bottomleft"
});
diabetesLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Diabetes Prevalence</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>18.4% - 31%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>14.7% - 18.4%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>12.3% - 14.7%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>10.6% - 12.3%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>8.8% - 10.6%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>6.4% - 8.8%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 6.4%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorDiabetes(percent) {
    return percent > 18.4 ?
        "#91003f" :
        percent > 14.7 ?
        "#ce1256" :
        percent > 12.3 ?
        "#e7298a" :
        percent > 10.6 ?
        "#df65b0" :
        percent > 8.8 ?
        "#c994c7" :
        percent > 6.4 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleDiabetes(feature) {
    return {
        fillColor: colorDiabetes(feature.properties.DIABETES),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
    //High_chole
var hCholestorolLayer =  L.geoJson(null, {
        style: styleCholestorol,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.High_chole + '%</strong> of residents have high cholesterol.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var cholestorolLegend = L.control({
    position: "bottomleft"
});
cholestorolLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>High Cholestorol</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>37.2% - 51.2%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>33% - 37.2%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>30.7% - 33%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>28.4% - 30.7%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>25.8% - 28.4%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>22.4% - 25.8%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 22.4%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorCholestorol(percent) {
    return percent > 37.2 ?
        "#91003f" :
        percent > 33 ?
        "#ce1256" :
        percent > 30.7 ?
        "#e7298a" :
        percent > 28.4 ?
        "#df65b0" :
        percent > 25.8 ?
        "#c994c7" :
        percent > 22.4 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleCholestorol(feature) {
    return {
        fillColor: colorCholestorol(feature.properties.High_chole),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
    //KIDNEY
var kidneyLayer =  L.geoJson(null, {
        style: styleKidney,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.KIDNEY + '%</strong> of residents have kidney disease.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var kidneyLegend = L.control({
    position: "bottomleft"
});
kidneyLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Chronic Kidney Disease</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>6.3% - 10.8%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>4.4% - 6.3%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>3.6% - 4.4%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>3.1% - 3.6%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>2.6% - 3.1%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>2% - 2.6%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 2%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorKidney(percent) {
    return percent > 6.3 ?
        "#91003f" :
        percent > 4.4 ?
        "#ce1256" :
        percent > 3.6 ?
        "#e7298a" :
        percent > 3.1 ?
        "#df65b0" :
        percent > 2.6 ?
        "#c994c7" :
        percent > 2 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleKidney(feature) {
    return {
        fillColor: colorKidney(feature.properties.KIDNEY),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//   SCREENING ---- 

//=========================


var cervicalLayer =  L.geoJson(null, {
        style: styleCervical,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.CERVICAL + '%</strong> of female residents (age 21–65) who have had cervical cancer screening test.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var cervicalLegend = L.control({
    position: "bottomleft"
});
cervicalLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Cervical Cancer Screening</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>87.4% - 91%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>85.2% - 87.4%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>82.6% - 85.2%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>79.1% - 82.6%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>74.6% - 79.1%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>66.6% - 74.6%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 66.6%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorCervical(percent) {
    return percent > 87.4 ?
        "#6e016b" :
        percent > 85.2 ?
        "#88419d" :
        percent > 82.6 ?
        "#8c6bb1" :
        percent > 79.1 ?
        "#8c96c6" :
        percent > 74.6 ?
        "#9ebcda" :
        percent > 66.6 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleCervical(feature) {
    return {
        fillColor: colorCervical(feature.properties.CERVICAL),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//CHECKUP

var checkupLayer =  L.geoJson(null, {
        style: styleCheck,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.CHECKUP + '%</strong> of residents  having been to a doctor for a routine checkup (e.g., a general physical exam) in the previous year.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var checkLegend = L.control({
    position: "bottomleft"
});
checkLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Annual Check Up</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>85.2% - 88.9%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>83.4% - 85.2%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>81.5% - 83.4%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>79.5% - 81.5%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>77.5% - 79.5%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>75.4% - 77.5%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 75.4%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorCheck(percent) {
    return percent > 85.2 ?
        "#6e016b" :
        percent > 83.4 ?
        "#88419d" :
        percent > 81.5 ?
        "#8c6bb1" :
        percent > 79.5 ?
        "#8c96c6" :
        percent > 77.5 ?
        "#9ebcda" :
        percent > 75.4 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleCheck(feature) {
    return {
        fillColor: colorCheck(feature.properties.CHECKUP),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//COLORECTAL

var colorectalLayer =  L.geoJson(null, {
        style: styleColorectal,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.COLORECTAL + '%</strong> of residents have received a recommended colorectal cancer screening test within the appropriate time interval.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var colorectalLegend = L.control({
    position: "bottomleft"
});
colorectalLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Colorectal Cancer Screening</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>69.2% - 74.1%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>65.9% - 69.2%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>62.6% - 65.9%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>58.8% - 62.6%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>54.4% - 58.8%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>48.8% - 54.4%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 48.8%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorColorectal(percent) {
    return percent > 69.2 ?
        "#6e016b" :
        percent > 65.9 ?
        "#88419d" :
        percent > 62.6 ?
        "#8c6bb1" :
        percent > 58.8 ?
        "#8c96c6" :
        percent > 54.4 ?
        "#9ebcda" :
        percent > 48.8 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleColorectal(feature) {
    return {
        fillColor: colorColorectal(feature.properties.COLORECTAL),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//DENTAL
var dentistLayer =  L.geoJson(null, {
        style: styleDentist,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.DENTAL + '%</strong> of residents report having been to the dentist or dental clinic in the previous year. </p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var dentistLegend = L.control({
    position: "bottomleft"
});
dentistLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Dental Check Up</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>76.8% - 85.1%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>71.1% - 76.8%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>66.1% - 71.1%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>61.1% - 66.1%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>55.8% - 61.1%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>48.8% - 55.8%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 48.8%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorDentist(percent) {
    return percent > 76.8 ?
        "#6e016b" :
        percent > 71.1 ?
        "#88419d" :
        percent > 66.1 ?
        "#8c6bb1" :
        percent > 61.1 ?
        "#8c96c6" :
        percent > 55.8 ?
        "#9ebcda" :
        percent > 48.8 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleDentist(feature) {
    return {
        fillColor: colorDentist(feature.properties.DENTAL),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
    //MAMMO
var mammogramLayer =  L.geoJson(null, {
        style: styleMammo,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.MAMMO + '%</strong> of female residents (aged 50–74 years) report having had a mammogram within the previous 2 years.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var mammoLegend = L.control({
    position: "bottomleft"
});
mammoLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Mammamography Screening</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>85.3% - 88.3%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>84% - 85.3%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>82.4% - 84%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>80.9% - 82.4%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>79.7% - 80.9%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>78.2% - 79.7%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 78.2%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorMammo(percent) {
    return percent > 85.3 ?
        "#6e016b" :
        percent > 84 ?
        "#88419d" :
        percent > 82.4?
        "#8c6bb1" :
        percent > 80.9 ?
        "#8c96c6" :
        percent > 79.7 ?
        "#9ebcda" :
        percent > 78.2 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleMammo(feature) {
    return {
        fillColor: colorMammo(feature.properties.MAMMO),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//   BEHAVIORS ---- 

//smokersTract 
var smokerLayer =  L.geoJson(null, {
        style: styleSmoke,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.SMOKING + '%</strong> of residents report having smoked ≥100 cigarettes in their lifetime and currently smoke every day or some days.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

// SMOKE LEGEND 
var smokeLegend = L.control({
    position: "bottomleft"
});
smokeLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Adult Smokers</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>25.3% - 32%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>21% - 25.3%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>17.6% - 21%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>15% - 17.6%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>12.8% - 15%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>10.3% - 12.8%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 10.3%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorSmoke(percent) {
    return percent > 25.3 ?
        "#034e7b" :
        percent > 21 ?
        "#0570b0" :
        percent > 17.6 ?
        "#3690c0" :
        percent > 15 ?
        "#74a9cf" :
        percent > 12.8 ?
        "#a6bddb" :
        percent > 10.3 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

// PLACES POLYGON OUTLINE COLORS
function styleSmoke(feature) {
    return {
        fillColor: colorSmoke(feature.properties.SMOKING),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
//drinkersTract  

var drinkersLayer =  L.geoJson(null, {
        style: styleDrink,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.DRINK + '%</strong> of residents have 4 or more alcoholic beverages on an occasion in the past 30 days.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var drinkLegend = L.control({
    position: "bottomleft"
});
drinkLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Frequent Drinkers</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>23.1% - 26.9%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>20.6% - 23.1%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>18.4% - 20.6%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>16.6% - 18.46%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>15.5% - 16.6%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>13.1% - 15.5%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 13.1%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorDrink(percent) {
    return percent > 23.1 ?
        "#034e7b" :
        percent > 20.6 ?
        "#0570b0" :
        percent > 18.4 ?
        "#3690c0" :
        percent > 16.6 ?
        "#74a9cf" :
        percent > 15.5 ?
        "#a6bddb" :
        percent > 13.1 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

function styleDrink(feature) {
    return {
        fillColor: colorDrink(feature.properties.DRINK),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//=========================
    //INACTIVE
var sedentaryLayer =  L.geoJson(null, {
        style: styleInactive,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.INACTIVE + '%</strong> of residents do not participate in physical activity or exercise other than their regular work.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var inactiveLegend = L.control({
    position: "bottomleft"
});
inactiveLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Physically Inactive</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>38.1% - 51%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>32.4% - 38.1%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>28.2% - 32.4%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>24.6% - 28.2%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>20.9% - 24.6%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>16.5% - 20.9%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 16.5%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorInactive(percent) {
    return percent > 38.1 ?
        "#034e7b" :
        percent > 32.4 ?
        "#0570b0" :
        percent > 28.2 ?
        "#3690c0" :
        percent > 24.6 ?
        "#74a9cf" :
        percent > 20.9 ?
        "#a6bddb" :
        percent > 16.5 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}


function styleInactive(feature) {
    return {
        fillColor: colorInactive(feature.properties.INACTIVE),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
    //OBESITY
var obesityLayer =  L.geoJson(null, {
        style: styleObese,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.OBESITY + '%</strong> of residents are obese (having a body mass index measure ≥ 30).</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

    // OBESITY LEGEND 
var obeseLegend = L.control({
    position: "bottomleft"
});
obeseLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Obesity Prevalence</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>BMI ≥ 30</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>34.3% - 40.6%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>31.1% - 34.3%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>28.2% - 31.1%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>25.2% - 28.2%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>22.3% - 25.2%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>19.7% - 22.3%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 19.7%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorObesity(percent) {
    return percent > 34.3 ?
        "#034e7b" :
        percent > 31.1 ?
        "#0570b0" :
        percent > 28.2 ?
        "#3690c0" :
        percent > 25.2 ?
        "#74a9cf" :
        percent > 22.3 ?
        "#a6bddb" :
        percent > 19.7 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

function styleObese(feature) {
    return {
        fillColor: colorObesity(feature.properties.OBESITY),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
    //SLEEPLESS
var sleepLayer =  L.geoJson(null, {
        style: styleSleep,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.SLEEPLESS + '%</strong> of residents sleep <7 hours on average, during a 24-hour period.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

    // SLEEP LEGEND 
var sleepLegend = L.control({
    position: "bottomleft"
});
sleepLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Sleep <7 Hours</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>47.7% - 51.8%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>45.2% - 47.7%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>42.8% - 45.2%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>40.4% - 48.2%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>38% - 40.4%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>35.4% - 38%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 35.4%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

// PLACES CHOROPLETH BY % CANCER PREVELANCE 51.8
function colorSleep(percent) {
    return percent > 47.7 ?
        "#034e7b" :
        percent > 45.2 ?
        "#0570b0" :
        percent > 42.8 ?
        "#3690c0" :
        percent > 40.4 ?
        "#74a9cf" :
        percent > 38 ?
        "#a6bddb" :
        percent > 35.4 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

function styleSleep(feature) {
    return {
        fillColor: colorSleep(feature.properties.SLEEPLESS),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
//UNINSURED
var uninsuredLayer =  L.geoJson(null, {
        style: styleUninsured,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.UNINSURED + '%</strong> of residents (aged 18–64) report having no current health insurance coverage.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

    // UNINSURED LEGEND 
var uninsuredLegend = L.control({
    position: "bottomleft"
});
uninsuredLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Percent Uninsured</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>28.3% - 35.8%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>23.4% - 28.3%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>19.1% - 23.4%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>15.6% - 19.1%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>12.8% - 15.6%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>9.8% - 12.8%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

// PLACES CHOROPLETH BY % CANCER PREVELANCE 35.8
function colorUninsured(percent) {
    return percent > 28.3 ?
        "#034e7b" :
        percent > 23.4 ?
        "#0570b0" :
        percent > 19.1 ?
        "#3690c0" :
        percent > 15.6 ?
        "#74a9cf" :
        percent > 12.8 ?
        "#a6bddb" :
        percent > 9.8 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

function styleUninsured(feature) {
    return {
        fillColor: colorUninsured(feature.properties.UNINSURED),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//POPULATION
var popLayer =  L.geoJson(null, {
        style: stylePop,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract. <p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

    // UNINSURED LEGEND 
var popLegend = L.control({
    position: "bottomleft"
});
popLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Population by Tract</h4>";
    div.innerHTML += '<i style="background: #005824"></i><span>6,126 - 8,938</span><br>';
    div.innerHTML += '<i style="background: #238b45"></i><span>4,848 - 6,126</span><br>';
    div.innerHTML += '<i style="background: #41ae76"></i><span>3,891 - 4,848</span><br>';
    div.innerHTML += '<i style="background: #66c2a4"></i><span>3,106 - 3,891</span><br>';
    div.innerHTML += '<i style="background: #99d8c9"></i><span>2,392 - 3,106</span><br>';
    div.innerHTML += '<i style="background: #ccece6"></i><span>1,678 - 2,392</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0 - 1,678</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorPop(percent) {
    return percent > 6126 ?
        "#005824" :
        percent > 4848 ?
        "#238b45" :
        percent > 3891 ?
        "#41ae76" :
        percent > 3106 ?
        "#66c2a4" :
        percent > 2392 ?
        "#99d8c9" :
        percent > 1678 ?
        "#ccece6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function stylePop(feature) {
    return {
        fillColor: colorPop(feature.properties.POPULATION),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
// PLACES TRACT GEOJSON

$.getJSON("PLACEStract_FeaturesToJSON.geojson", function(data) {
    cancerLayer.addData(data);
    smokerLayer.addData(data);
    heartDiseaseLayer.addData(data);
    checkupLayer.addData(data);
    colorectalLayer.addData(data);
    dentistLayer.addData(data);
    diabetesLayer.addData(data);
    hCholestorolLayer.addData(data);
    kidneyLayer.addData(data);
    sedentaryLayer.addData(data);
    mammogramLayer.addData(data);
    obesityLayer.addData(data);
    sleepLayer.addData(data);
    uninsuredLayer.addData(data);
    cervicalLayer.addData(data);
    asthmaLayer.addData(data);
    bloodPressureLayer.addData(data);
    drinkersLayer.addData(data);
    popLayer.addData(data);
});


//===================================================== CHARTS TABBED BOX  =============================================================

function openCity(evt, cityName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-blue", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " w3-blue";
}

//=================================================== ZIPCODE OUTLINES =====================================================
// highlight above all other layers
mymap.createPane("pane660").style.zIndex = 660;

// HIGHLIGHT SELECTED ZIP CODE BOUNDARY

zipOutlines = L.geoJson(null, {
    style: styleZIP
    }).addTo(mymap); 

function highLight(zipSelected) {
    mymap.removeLayer(zipOutlines);
    zipOutlines = L.geoJson(null, {
    pane: "pane660",
    style: styleZIP,
    interactive: false 
    }).addTo(mymap); 

$.getJSON("ZIP_CODE_outlines.geojson", function(data) {   
    var objects = data.features.find(function(feature) {
    return feature.properties.ZIPCODE == zipSelected;
});
    zipOutlines.addData(objects);
});
        }

function styleZIP(feature) {
    if (zipSelected == feature.properties.ZIPCODE) {
    return {
        fillColor: feature.properties.ZIPCODE,
        weight: 5,
        opacity: 1,
        color: 'yellow',
        fillOpacity: 0.1,
    }} else {
            return {
                weight: 0.1,
                opacity: 0.1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0,
                fillColor: 'white',
            };
        } 
    }

//=========================================================== LANGUAGE DRILL DOWN =================================================================

//SPEAKERS OF OTHER LANGUAGES | NON-ENGLISH
var solLayer =  L.geoJson(null, {
        style: styleSol,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var solLegend = L.control({
    position: "bottomleft"
});
solLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Speakers of Languages</h4>";
    div.innerHTML += "<h4>Other than English</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>78.6% - 93.1%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>64.2% - 78.5%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>49.8% - 64.1%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>35.4% - 49.7%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>20.9% - 35.3%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 20.8%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorSol(percent) {
    return percent > 78.5 ?
        "#005a32" :
        percent > 64.1 ?
        "#31a354" :
        percent > 49.7 ?
        "#41ab5d" :
        percent > 35.3 ?
        "#74c476" :
        percent > 20.8 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleSol(feature) {
    return {
        fillColor: colorSol(feature.properties.Speak_non_),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}



//ARABIC
var arabicLayer =  L.geoJson(null, {
        style: styleArabic,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Arabic + '% spoke Arabic.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var arabicLegend = L.control({
    position: "bottomleft"
});
arabicLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Arabic Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>28.6% - 38.4%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>22.9% - 28.5%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>17.2% - 22.8%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>11.5% - 17.1%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>5.8% - 11.4%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 5.7%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorArabic(percent) {
    return percent > 28.5 ?
        "#005a32" :
        percent > 22.8 ?
        "#31a354" :
        percent > 17.1 ?
        "#41ab5d" :
        percent > 11.4 ?
        "#74c476" :
        percent > 5.7 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleArabic(feature) {
    return {
        fillColor: colorArabic(feature.properties.Arabic),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//AFRICAN LANGUAGES
var africanLayer =  L.geoJson(null, {
        style: styleAfrican,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.African_la + '% spoke an African language such as Akan (incl. Twi), Edo, Hausa, Igbo (Ibo), Swahili, Wolof, or Yoruba.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var africanLegend = L.control({
    position: "bottomleft"
});
africanLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>African Language Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>45.7% - 54.8%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>36.6% - 45.6%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>27.5% - 36.5%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>18.4% - 27.4%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>9.3% - 18.3%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 9.2%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorAfrican(percent) {
    return percent > 46.6 ?
        "#005a32" :
        percent > 36.5 ?
        "#31a354" :
        percent > 24.7 ?
        "#41ab5d" :
        percent > 18.3 ?
        "#74c476" :
        percent > 9.2 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleAfrican(feature) {
    return {
        fillColor: colorAfrican(feature.properties.African_la),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//CHINESE
var chineseLayer =  L.geoJson(null, {
        style: styleChinese,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Chinese + '% spoke a Chinese language, including Mandarin, Min Nan (including Taiwanese), or Yue Chinese (Cantonese).</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var chineseLegend = L.control({
    position: "bottomleft"
});
chineseLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Chinese Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>69.7% - 83.6%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>55.8% - 69.6%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>41.9% - 55.7%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>28.0% - 41.8%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>14.1% - 27.9%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 14.0%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorChinese(percent) {
    return percent > 69.6 ?
        "#005a32" :
        percent > 55.7 ?
        "#31a354" :
        percent > 41.8 ?
        "#41ab5d" :
        percent > 27.9 ?
        "#74c476" :
        percent > 14.0 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleChinese(feature) {
    return {
        fillColor: colorChinese(feature.properties.Chinese),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//FRENCH
var frenchLayer =  L.geoJson(null, {
        style: styleFrench,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.French_inc + '% spoke French, French Patois, Cajun French, or another French Creole.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var frenchLegend = L.control({
    position: "bottomleft"
});
frenchLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>French Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>27.5% - 38.4%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>22.0% - 27.4%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>16.5% - 21.9%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>11.1% - 16.4%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>5.6% - 11.0%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 5.5%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorFrench(percent) {
    return percent > 27.4 ?
        "#005a32" :
        percent > 21.9 ?
        "#31a354" :
        percent > 16.4 ?
        "#41ab5d" :
        percent > 11.0 ?
        "#74c476" :
        percent > 5.5 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleFrench(feature) {
    return {
        fillColor: colorFrench(feature.properties.French_inc),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//GERMAN
var germanLayer =  L.geoJson(null, {
        style: styleGerman,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.German + '% spoke German.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var germanLegend = L.control({
    position: "bottomleft"
});
germanLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>German Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>10.7% - 17.1%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>8.7% - 10.6%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>6.5% - 8.6%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>4.5% - 6.4%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>2.4% - 4.4%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 2.3%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorGerman(percent) {
    return percent > 10.6 ?
        "#005a32" :
        percent > 8.6 ?
        "#31a354" :
        percent > 6.4 ?
        "#41ab5d" :
        percent > 4.4 ?
        "#74c476" :
        percent > 2.3 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleGerman(feature) {
    return {
        fillColor: colorGerman(feature.properties.German),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//GREEK
var greekLayer =  L.geoJson(null, {
        style: styleGreek,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Greek + '% spoke Greek.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var greekLegend = L.control({
    position: "bottomleft"
});
greekLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Greek Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>26.1% - 31.2%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>20.9% - 26.0%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>15.7% - 20.8%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>10.5% - 15.6%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>5.3% - 10.4%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 5.2%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorGreek(percent) {
    return percent > 26 ?
        "#005a32" :
        percent > 20.8 ?
        "#31a354" :
        percent > 15.6 ?
        "#41ab5d" :
        percent > 10.4 ?
        "#74c476" :
        percent > 5.2 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleGreek(feature) {
    return {
        fillColor: colorGreek(feature.properties.Greek),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//HAITIAN CREOLE
var haitianLayer =  L.geoJson(null, {
        style: styleHaitian,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.French_Cre + '% spoke Haitian Creole.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var haitianLegend = L.control({
    position: "bottomleft"
});
haitianLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Haitian Creole Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>79.1% - 94.8%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>63.3% - 79.0%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>47.5% - 63.2%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>31.7% - 47.4%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>15.9% - 31.6%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 15.8%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorHaitian(percent) {
    return percent > 79.0 ?
        "#005a32" :
        percent > 63.2 ?
        "#31a354" :
        percent > 47.4 ?
        "#41ab5d" :
        percent > 31.6 ?
        "#74c476" :
        percent > 15.8 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleHaitian(feature) {
    return {
        fillColor: colorHaitian(feature.properties.French_Cre),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//HEBREW
var hebrewLayer =  L.geoJson(null, {
        style: styleHebrew,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Hebrew + '% spoke Hebrew.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var hebrewLegend = L.control({
    position: "bottomleft"
});
hebrewLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Hebrew Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>52.0% - 62.3%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>41.6% - 51.9%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>31.3% - 41.5%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>20.9% - 31.2%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>10.5% - 20.8%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 10.4%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorHebrew(percent) {
    return percent > 51.9 ?
        "#005a32" :
        percent > 41.5 ?
        "#31a354" :
        percent > 31.2 ?
        "#41ab5d" :
        percent > 20.8 ?
        "#74c476" :
        percent > 10.4 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleHebrew(feature) {
    return {
        fillColor: colorHebrew(feature.properties.Hebrew),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//ITALIAN
var italianLayer =  L.geoJson(null, {
        style: styleItalian,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Italian + '% spoke Italian, Calabrese, Neopolitan, or Sicilian.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var italianLegend = L.control({
    position: "bottomleft"
});
italianLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Italian Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>38.5% - 57.8%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>29.0% - 38.4%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>21.8% - 28.9%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>14.6% - 21.7%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>7.4% - 14.5%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 7.3%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorItalian(percent) {
    return percent > 38.4 ?
        "#005a32" :
        percent > 28.9 ?
        "#31a354" :
        percent > 21.7 ?
        "#41ab5d" :
        percent > 14.5 ?
        "#74c476" :
        percent > 7.3 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleItalian(feature) {
    return {
        fillColor: colorItalian(feature.properties.Italian),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//POLISH
var polishLayer =  L.geoJson(null, {
        style: stylePolish,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Polish + '% spoke Polish.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var polishLegend = L.control({
    position: "bottomleft"
});
polishLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Polish Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>62.2% - 82.9%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>51.9% - 62.1%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>34.6% - 51.8%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>20.9% - 34.5%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>10.5% - 20.8%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 10.4%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorPolish(percent) {
    return percent > 62.1 ?
        "#005a32" :
        percent > 51.8 ?
        "#31a354" :
        percent > 34.5 ?
        "#41ab5d" :
        percent > 20.8 ?
        "#74c476" :
        percent > 10.4 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function stylePolish(feature) {
    return {
        fillColor: colorPolish(feature.properties.Polish),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//RUSSIAN
var russianLayer =  L.geoJson(null, {
        style: styleRussian,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Russian + '% spoke Russian.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var russianLegend = L.control({
    position: "bottomleft"
});
russianLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Russian Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>78.3% - 93.8%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>62.3% - 78.2%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>47.1% - 62.2%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>31.5% - 47.0%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>15.9% - 31.4%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.2% - 15.8%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorRussian(percent) {
    return percent > 78.2 ?
        "#005a32" :
        percent > 62.2 ?
        "#31a354" :
        percent > 47.0 ?
        "#41ab5d" :
        percent > 31.4 ?
        "#74c476" :
        percent > 15.8 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleRussian(feature) {
    return {
        fillColor: colorRussian(feature.properties.Russian),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//SPANISH
var spanishLayer =  L.geoJson(null, {
        style: styleSpanish,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Spanish_or + '% spoke Spanish.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var spanishLegend = L.control({
    position: "bottomleft"
});
spanishLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Spanish Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>83.1% - 99.8%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>66.6% - 83.1%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>50.0% - 66.5%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>33.4% - 49.9%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>16.8% - 33.3%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 16.7%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorSpanish(percent) {
    return percent > 83.1 ?
        "#005a32" :
        percent > 66.5 ?
        "#31a354" :
        percent > 49.9 ?
        "#41ab5d" :
        percent > 33.3 ?
        "#74c476" :
        percent > 16.7 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleSpanish(feature) {
    return {
        fillColor: colorSpanish(feature.properties.Spanish_or),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//TAGALOG
var tagalogLayer =  L.geoJson(null, {
        style: styleTagalog,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Tagalog + '% spoke Tagalog.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var tagalogLegend = L.control({
    position: "bottomleft"
});
tagalogLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Tagalog Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>13.0% - 21.8%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>8.8% - 12.9%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>6.2% - 8.7%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>4.5% - 6.1%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>2.3% - 4.4%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 2.2%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorTagalog(percent) {
    return percent > 12.9 ?
        "#005a32" :
        percent > 8.7 ?
        "#31a354" :
        percent > 6.1 ?
        "#41ab5d" :
        percent > 4.4 ?
        "#74c476" :
        percent > 2.2 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleTagalog(feature) {
    return {
        fillColor: colorTagalog(feature.properties.Tagalog),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//URDU
var urduLayer =  L.geoJson(null, {
        style: styleUrdu,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Urdu + '% spoke Urdu.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var urduLegend = L.control({
    position: "bottomleft"
});
urduLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Urdu Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>29.4% - 45.5%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>18.3% - 29.3%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>13.8% - 18.2%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>9.2% - 13.7%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>4.7% - 9.1%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 4.6%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorUrdu(percent) {
    return percent > 29.3 ?
        "#005a32" :
        percent > 18.2 ?
        "#31a354" :
        percent > 13.7 ?
        "#41ab5d" :
        percent > 9.1 ?
        "#74c476" :
        percent > 4.6 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleUrdu(feature) {
    return {
        fillColor: colorUrdu(feature.properties.Urdu),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//YIDDISH
var yiddishLayer =  L.geoJson(null, {
        style: styleYiddish,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Yiddish + '% spoke varieties of Yiddish</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var yiddishLegend = L.control({
    position: "bottomleft"
});
yiddishLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Yiddish Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>78.5% - 94.1%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>62.8% - 78.4%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>47.2% - 62.7%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>31.5% - 47.1%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>15.8% - 31.4%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 15.7%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorYiddish(percent) {
    return percent > 78.4 ?
        "#005a32" :
        percent > 62.7 ?
        "#31a354" :
        percent > 47.1 ?
        "#41ab5d" :
        percent > 31.4 ?
        "#74c476" :
        percent > 15.7 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleYiddish(feature) {
    return {
        fillColor: colorYiddish(feature.properties.Yiddish),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//OTHER ASIAN LANGUAGES
var asianLayer =  L.geoJson(null, {
        style: styleAsian,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Other_Asia + '% spoke Korean, Japanese, Vietnamese, Thai, Mon-Khmar (Cambodian), Turkish, Uzbek, or other Asian languages other than Chinese.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var asianLegend = L.control({
    position: "bottomleft"
});
asianLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Other Asian Language Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>28.9% - 41.3%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>16.3% - 28.8%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>12.3% - 16.2%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>8.4% - 12.2%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>4.3% - 8.3%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 4.2%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorAsian(percent) {
    return percent > 28.8 ?
        "#005a32" :
        percent > 16.2 ?
        "#31a354" :
        percent > 12.2 ?
        "#41ab5d" :
        percent > 8.3 ?
        "#74c476" :
        percent > 4.2 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleAsian(feature) {
    return {
        fillColor: colorAsian(feature.properties.Other_Asia),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//OTHER INDIC LANGUAGES
var indicLayer =  L.geoJson(null, {
        style: styleIndic,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Other_Indi + '% spoke languages of India other than Urdu. This includes Bengali, Hindi, Gujarata, Punjabi, and Tamil.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var indicLegend = L.control({
    position: "bottomleft"
});
indicLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Other Indic Language Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>42.7% - 51.2%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>34.2% - 42.6%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>25.7% - 34.1%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>17.2% - 25.6%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>8.7% - 17.1%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 8.6%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorIndic(percent) {
    return percent > 42.6 ?
        "#005a32" :
        percent > 34.1 ?
        "#31a354" :
        percent > 25.6 ?
        "#41ab5d" :
        percent > 17.1 ?
        "#74c476" :
        percent > 8.6 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleIndic(feature) {
    return {
        fillColor: colorIndic(feature.properties.Other_Indi),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//Indo-European Languages
var indoeuropeanLayer =  L.geoJson(null, {
        style: styleIndoEuropean,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.Total).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract. In 2014, <strong>' + feature.properties.Speak_non_ + '%</strong> of residents spoke a language other than English. Of those, ' + feature.properties.Other_Indo + '% spoke Indo-European languages, including Armenian, Persian (Farsi), Pashto (Pushto), Swedish, or Ukranian.</p><p style="font-size: 9px;">Data is from the American Community Survey Table B16001 Table B16001</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var indoeuropeanLegend = L.control({
    position: "bottomleft"
});
indoeuropeanLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Indo-European Language Speakers</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>18.3% - 21.6%</span><br>';
    div.innerHTML += '<i style="background: #31a354"></i><span>14.5% - 18.2%</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>10.9% - 14.4%</span><br>';
    div.innerHTML += '<i style="background: #74c476"></i><span>7.3% - 10.8%</span><br>';
    div.innerHTML += '<i style="background: #a1d99b"></i><span>3.7% - 7.2%</span><br>';
    div.innerHTML += '<i style="background: #c7e9c0"></i><span>0.1% - 3.6%</span><br>';
    div.innerHTML += '<i style="background: #edf8e9"></i><span>0%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorIndoEuropean(percent) {
    return percent > 18.2 ?
        "#005a32" :
        percent > 14.4 ?
        "#31a354" :
        percent > 10.8 ?
        "#41ab5d" :
        percent > 7.2 ?
        "#74c476" :
        percent > 3.6 ?
        "#a1d99b" :
        percent > 0 ?
        "#c7e9c0" :
        percent == 0 ?
        "#edf8e9" :
        "#606060";
}

function styleIndoEuropean(feature) {
    return {
        fillColor: colorIndoEuropean(feature.properties.Other_Indo),
        weight: 0.5,
        opacity: 1,
        color: 'silver',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//=========================
// LANGUAGE DRILL DOWN GEOJSON

$.getJSON("allLanguages.geojson", function(data) {
    arabicLayer.addData(data);
    africanLayer.addData(data);
    chineseLayer.addData(data);
    frenchLayer.addData(data);
    germanLayer.addData(data);
    greekLayer.addData(data);
    haitianLayer.addData(data);
    hebrewLayer.addData(data);
    italianLayer.addData(data);
    polishLayer.addData(data);
    russianLayer.addData(data);
    spanishLayer.addData(data);
    tagalogLayer.addData(data);
    urduLayer.addData(data);
    yiddishLayer.addData(data);
    asianLayer.addData(data);
    indicLayer.addData(data);
    indoeuropeanLayer.addData(data);
    solLayer.addData(data);
});



//=========================================================== CANCER DRILL DOWN =================================================================

//FEMALE BREAST O/E
var breastRatioLayer =  L.geoJson(null, {
        style: styleBreastRatio,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the ratio of observed over expected cancer diagnoses was <strong>' + (feature.properties.Breast_Rat).toLocaleString('en', {maximumFractionDigits:2}) + '</strong> case(s) observed, for ever 1 case that was expected given the size and age of the population, for women age 18 and over.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var breastRatioLegend = L.control({
    position: "bottomleft"
});
breastRatioLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Female Breast Cancer</h4>";
    div.innerHTML += "<h4>Observed/Expected Rate</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>2.45 - 2.91</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>2.00 - 2.44</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>1.54 - 1.99</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>1.08 - 1.53</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>0.63 - 1.07</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>0.16 - 0.62</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorBreastRatio(percent) {
    return percent > 2.44 ?
        "#91003f" :
        percent > 1.99 ?
        "#ce1256" :
        percent > 1.53 ?
        "#e7298a" :
        percent > 1.07 ?
        "#df65b0" :
        percent > 0.62 ?
        "#c994c7" :
        percent > 0 ?
        "#d4b9da" :
        percent == 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleBreastRatio(feature) {
    return {
        fillColor: colorBreastRatio(feature.properties.Breast_Rat),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//FEMALE BREAST CRUDE
var breastCrudeLayer =  L.geoJson(null, {
        style: styleBreastCrude,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the crude incidence rate in this tract was <strong>' + (feature.properties.Breast_O_p).toLocaleString('en', {maximumFractionDigits:2}) + ' per 1,000</strong> adults over the age of 18.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var breastCrudeLegend = L.control({
    position: "bottomleft"
});
breastCrudeLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Crude Female Breast</h4>";
    div.innerHTML += "<h4>Cancer Rate</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>per 1,000 adults (18+)</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>24.59 - 29.32</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>19.86 - 24.58</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>15.14 - 19.85</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>10.41 - 15.13</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>5.68 - 10.40</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>0.94 - 5.67</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorBreastCrude(percent) {
    return percent > 24.5 ?
        "#91003f" :
        percent > 19.8 ?
        "#ce1256" :
        percent > 15.13 ?
        "#e7298a" :
        percent > 10.4 ?
        "#df65b0" :
        percent > 5.67 ?
        "#c994c7" :
        percent > 0 ?
        "#d4b9da" :
        percent == 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleBreastCrude(feature) {
    return {
        fillColor: colorBreastCrude(feature.properties.Breast_O_p),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}



//COLORECTAL O/E
var colorectalRatioLayer =  L.geoJson(null, {
        style: styleColorectalRatio,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the ratio of observed over expected cancer diagnoses was <strong>' + (feature.properties.Colorect_3).toLocaleString('en', {maximumFractionDigits:2}) + '</strong> case(s) observed, for ever 1 case that was expected given the size and age of the population, for adults age 18 and over.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var colorectalRatioLegend = L.control({
    position: "bottomleft"
});
colorectalRatioLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Colorectal Cancer</h4>";
    div.innerHTML += "<h4>Observed/Expected Rate</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>2.38 - 3.34</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>1.90 - 2.37</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>1.43 - 1.89</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>0.95 - 1.42</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>0.48 - 0.94</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>0.13 - 0.47</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorColorectalRatio(percent) {
    return percent > 2.84 ?
        "#034e7b" :
        percent > 2.37 ?
        "#0570b0" :
        percent > 1.89 ?
        "#3690c0" :
        percent > 1.42 ?
        "#74a9cf" :
        percent > 0.47 ?
        "#a6bddb" :
        percent > 0 ?
        "#d0d1e6" :
        percent == 0 ?
        "#f1eef6" :
        "#606060";
}

function styleColorectalRatio(feature) {
    return {
        fillColor: colorColorectalRatio(feature.properties.Colorect_3),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//COLORECTAL CRUDE
var colorectalCrudeLayer =  L.geoJson(null, {
        style: styleColorectalCrude,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the crude incidence rate for colorectal cancer in this tract was <strong>' + (feature.properties.Colorect_2).toLocaleString('en', {maximumFractionDigits:2}) + ' cases per 1,000 adults</strong> over the age of 18.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var colorectalCrudeLegend = L.control({
    position: "bottomleft"
});
colorectalCrudeLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Crude Colorectal</h4>";
    div.innerHTML += "<h4>Cancer Rate</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>per 1,000 adults (18+)</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>4.81 - 5.77</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>3.86 - 4.80</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>2.90 - 3.85</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>1.94 - 2.89</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>0.98 - 1.93</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>0.02 - 0.97</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorColorectalCrude(percent) {
    return percent > 4.80 ?
        "#034e7b" :
        percent > 3.85 ?
        "#0570b0" :
        percent > 2.89 ?
        "#3690c0" :
        percent > 1.93 ?
        "#74a9cf" :
        percent > 0.97 ?
        "#a6bddb" :
        percent > 0 ?
        "#d0d1e6" :
        percent == 0 ?
        "#f1eef6" :
        "#606060";
}

function styleColorectalCrude(feature) {
    return {
        fillColor: colorColorectalCrude(feature.properties.Colorect_2),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//LUNG O/E
var lungRatioLayer =  L.geoJson(null, {
        style: styleLungRatio,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the ratio of observed over expected cancer diagnoses was <strong>' + (feature.properties.Lung_Ratio).toLocaleString('en', {maximumFractionDigits:2}) + '</strong> case(s) observed, for ever 1 case that was expected given the size and age of the population, for adults age 18 and over.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var lungRatioLegend = L.control({
    position: "bottomleft"
});
lungRatioLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Lung Cancer</h4>";
    div.innerHTML += "<h4>Observed/Expected Rate</h4>";
    div.innerHTML += '<i style="background: #868B96"></i><span>3.13 - 3.75</span><br>';
    div.innerHTML += '<i style="background: #969AA2"></i><span>2.51 - 3.12</span><br>';
    div.innerHTML += '<i style="background: #A6AAAF"></i><span>1.88 - 2.50</span><br>';
    div.innerHTML += '<i style="background: #B7B9BB"></i><span>1.26 - 1.87</span><br>';
    div.innerHTML += '<i style="background: #C7C9C8"></i><span>0.63 - 1.25</span><br>';
    div.innerHTML += '<i style="background: #D7D8D4"></i><span>0.11 - 0.62</span><br>';
    div.innerHTML += '<i style="background: #FEFEFE"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorLungRatio(percent) {
    return percent > 3.12 ?
        "#868B96" :
        percent > 2.50 ?
        "#969AA2" :
        percent > 1.87 ?
        "#A6AAAF" :
        percent > 1.25 ?
        "#B7B9BB" :
        percent > 0.62 ?
        "#C7C9C8" :
        percent > 0 ?
        "#D7D8D4" :
        percent == 0 ?
        "#FEFEFE" :
        "#606060";
}

function styleLungRatio(feature) {
    return {
        fillColor: colorLungRatio(feature.properties.Lung_Ratio),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//LUNG CRUDE
var lungCrudeLayer =  L.geoJson(null, {
        style: styleLungCrude,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the crude incidence rate for colorectal cancer in this tract was <strong>' + (feature.properties.Lung_O_pop).toLocaleString('en', {maximumFractionDigits:2}) + ' cases per 1,000 adults</strong> over the age of 18.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var lungCrudeLegend = L.control({
    position: "bottomleft"
});
lungCrudeLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Crude Lung Cancer Rate</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>per 1,000 adults (18+)</h4>";
    div.innerHTML += '<i style="background: #868B96"></i><span>11.15 - 25.05</span><br>';
    div.innerHTML += '<i style="background: #969AA2"></i><span>8.97 - 11.14</span><br>';
    div.innerHTML += '<i style="background: #A6AAAF"></i><span>6.80 - 8.96</span><br>';
    div.innerHTML += '<i style="background: #B7B9BB"></i><span>4.62 - 6.79</span><br>';
    div.innerHTML += '<i style="background: #C7C9C8"></i><span>2.45 - 4.61</span><br>';
    div.innerHTML += '<i style="background: #D7D8D4"></i><span>0.27 - 2.44</span><br>';
    div.innerHTML += '<i style="background: #FEFEFE"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorLungCrude(percent) {
    return percent > 11.14 ?
        "#868B96" :
        percent > 8.96 ?
        "#969AA2" :
        percent > 6.79 ?
        "#A6AAAF" :
        percent > 4.61 ?
        "#B7B9BB" :
        percent > 2.44 ?
        "#C7C9C8" :
        percent > 0 ?
        "#D7D8D4" :
        percent == 0 ?
        "#FEFEFE" :
        "#606060";
}

function styleLungCrude(feature) {
    return {
        fillColor: colorLungCrude(feature.properties.Lung_O_pop),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

// //NON-HODGKIN LYMPHOMA O/E

var nhlRatioLayer =  L.geoJson(null, {
        style: styleNHLRatio,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the ratio of observed over expected cancer diagnoses was <strong>' + (feature.properties.Lymphoma_R).toLocaleString('en', {maximumFractionDigits:2}) + '</strong> case(s) observed, for ever 1 case that was expected given the size and age of the population, for adults age 18 and over.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var nhlRatioLegend = L.control({
    position: "bottomleft"
});
nhlRatioLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Non-Hodgkin's Lymphoma</h4>";
    div.innerHTML += "<h4>Observed/Expected Rate</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>4.01 - 6.67</span><br>';
    div.innerHTML += '<i style="background: #238443"></i><span>3.24 - 4.00</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>2.48 - 3.23</span><br>';
    div.innerHTML += '<i style="background: #78c679"></i><span>1.72 - 2.47</span><br>';
    div.innerHTML += '<i style="background: #addd8e"></i><span>0.96 - 1.71</span><br>';
    div.innerHTML += '<i style="background: #d9f0a3"></i><span>0.19 - 0.95</span><br>';
    div.innerHTML += '<i style="background: #ffffcc"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorNHLRatio(percent) {
    return percent > 4 ?
        "#005a32" :
        percent > 3.23 ?
        "#238443" :
        percent > 2.47 ?
        "#41ab5d" :
        percent > 1.71 ?
        "#78c679" :
        percent > 0.95 ?
        "#addd8e" :
        percent > 0 ?
        "#d9f0a3" :
        percent == 0 ?
        "#ffffcc" :
        "#606060";
}

function styleNHLRatio(feature) {
    return {
        fillColor: colorNHLRatio(feature.properties.Lymphoma_R),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//NON-HODGKIN LYMPHOMA CRUDE
var nhlCrudeLayer =  L.geoJson(null, {
        style: styleNHLCrude,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the crude incidence rate for colorectal cancer in this tract was <strong>' + (feature.properties.NHLymphoma).toLocaleString('en', {maximumFractionDigits:2}) + ' cases per 1,000 adults</strong> over the age of 18.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var nhlCrudeLegend = L.control({
    position: "bottomleft"
});
nhlCrudeLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Crude Non-Hodgkin's</h4>";
    div.innerHTML += "<h4>Lymphoma Rate</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>per 1,000 adults (18+)</h4>";
    div.innerHTML += '<i style="background: #005a32"></i><span>6.16 - 7.39</span><br>';
    div.innerHTML += '<i style="background: #238443"></i><span>4.93 - 6.15</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>3.70 - 4.92</span><br>';
    div.innerHTML += '<i style="background: #78c679"></i><span>2.47 - 3.69</span><br>';
    div.innerHTML += '<i style="background: #addd8e"></i><span>1.24 - 2.46</span><br>';
    div.innerHTML += '<i style="background: #d9f0a3"></i><span>0.22 - 1.23</span><br>';
    div.innerHTML += '<i style="background: #ffffcc"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorNHLCrude(percent) {
    return percent > 6.15 ?
        "#005a32" :
        percent > 4.92 ?
        "#238443" :
        percent > 3.69 ?
        "#41ab5d" :
        percent > 2.46 ?
        "#78c679" :
        percent > 1.23 ?
        "#addd8e" :
        percent > 0 ?
        "#d9f0a3" :
        percent == 0 ?
        "#ffffcc" :
        "#606060";
}

function styleNHLCrude(feature) {
    return {
        fillColor: colorNHLCrude(feature.properties.NHLymphoma),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


// //PROSTATE O/E

var prostateRatioLayer =  L.geoJson(null, {
        style: styleProstateRatio,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the ratio of observed over expected cancer diagnoses was <strong>' + (feature.properties.Prostate_R).toLocaleString('en', {maximumFractionDigits:2}) + '</strong> case(s) observed, for ever 1 case that was expected given the size and age of the population, for adults age 18 and over.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var prostateRatioLegend = L.control({
    position: "bottomleft"
});
prostateRatioLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Prostate Cancer</h4>";
    div.innerHTML += "<h4>Observed/Expected Rate</h4>";
    div.innerHTML += '<i style="background: #084594"></i><span>2.36 - 5.00</span><br>';
    div.innerHTML += '<i style="background: #2171b5"></i><span>1.89 - 2.35</span><br>';
    div.innerHTML += '<i style="background: #4292c6"></i><span>1.42 - 1.88</span><br>';
    div.innerHTML += '<i style="background: #6baed6"></i><span>0.95 - 1.41</span><br>';
    div.innerHTML += '<i style="background: #9ecae1"></i><span>0.48 - 0.94</span><br>';
    div.innerHTML += '<i style="background: #c6dbef"></i><span>0.11 - 0.47</span><br>';
    div.innerHTML += '<i style="background: #eff3ff"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorProstateRatio(percent) {
    return percent > 2.35 ?
        "#084594" :
        percent > 1.88 ?
        "#2171b5" :
        percent > 1.41 ?
        "#4292c6" :
        percent > 0.94 ?
        "#6baed6" :
        percent > 0.47 ?
        "#9ecae1" :
        percent > 0 ?
        "#c6dbef" :
        percent == 0 ?
        "#eff3ff" :
        "#606060";
}

function styleProstateRatio(feature) {
    return {
        fillColor: colorProstateRatio(feature.properties.Prostate_R),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//PROSTATE CRUDE
var prostateCrudeLayer =  L.geoJson(null, {
        style: styleProstateCrude,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the crude incidence rate for colorectal cancer in this tract was <strong>' + (feature.properties.Prostate_1).toLocaleString('en', {maximumFractionDigits:2}) + ' cases per 1,000 adults</strong> over the age of 18.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var prostateCrudeLegend = L.control({
    position: "bottomleft"
});
prostateCrudeLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Crude Prostate Cancer Rate</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>per 1,000 adults (18+)</h4>";
    div.innerHTML += '<i style="background: #084594"></i><span>24.65 - 29.58</span><br>';
    div.innerHTML += '<i style="background: #2171b5"></i><span>19.72 - 24.64</span><br>';
    div.innerHTML += '<i style="background: #4292c6"></i><span>14.79 - 19.71</span><br>';
    div.innerHTML += '<i style="background: #6baed6"></i><span>9.86 - 14.78</span><br>';
    div.innerHTML += '<i style="background: #9ecae1"></i><span>4.93 - 9.85</span><br>';
    div.innerHTML += '<i style="background: #c6dbef"></i><span>0.64 - 4.92</span><br>';
    div.innerHTML += '<i style="background: #eff3ff"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorProstateCrude(percent) {
    return percent > 24.64 ?
        "#084594" :
        percent > 19.71 ?
        "#2171b5" :
        percent > 14.78 ?
        "#4292c6" :
        percent > 9.85 ?
        "#6baed6" :
        percent > 4.92 ?
        "#9ecae1" :
        percent > 0 ?
        "#c6dbef" :
        percent == 0 ?
        "#eff3ff" :
        "#606060";
}

function styleProstateCrude(feature) {
    return {
        fillColor: colorProstateCrude(feature.properties.Prostate_1),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


// URINARY BLADDER O/E

var bladderRatioLayer =  L.geoJson(null, {
        style: styleBladderRatio,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the ratio of observed over expected cancer diagnoses was <strong>' + (feature.properties.Bladder_Ra).toLocaleString('en', {maximumFractionDigits:2}) + '</strong> case(s) observed, for ever 1 case that was expected given the size and age of the population, for adults age 18 and over.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var bladderRatioLegend = L.control({
    position: "bottomleft"
});
bladderRatioLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Urinary Bladder Cancer</h4>";
    div.innerHTML += "<h4>Observed/Expected Rate</h4>";
    div.innerHTML += '<i style="background: #8c2d04"></i><span>4.20 - 5.00</span><br>';
    div.innerHTML += '<i style="background: #cc4c02"></i><span>3.13 - 4.19</span><br>';
    div.innerHTML += '<i style="background: #ec7014"></i><span>2.58 - 3.12</span><br>';
    div.innerHTML += '<i style="background: #fe9929"></i><span>1.78 - 2.57</span><br>';
    div.innerHTML += '<i style="background: #fec44f"></i><span>0.97 - 1.77</span><br>';
    div.innerHTML += '<i style="background: #fee391"></i><span>0.15 - 0.96</span><br>';
    div.innerHTML += '<i style="background: #ffffd4"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorBladderRatio(percent) {
    return percent > 4.19 ?
        "#8c2d04" :
        percent > 3.12 ?
        "#cc4c02" :
        percent > 2.57 ?
        "#ec7014" :
        percent > 1.77 ?
        "#fe9929" :
        percent > 0.96 ?
        "#fec44f" :
        percent > 0 ?
        "#fee391" :
        percent == 0 ?
        "#ffffd4" :
        "#606060";
}

function styleBladderRatio(feature) {
    return {
        fillColor: colorBladderRatio(feature.properties.Bladder_Ra),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


// URINARY BLADDER CRUDE
var bladderCrudeLayer =  L.geoJson(null, {
        style: styleBladderCrude,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.S0101_Tota).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> adults, age 18 and over, live in this census tract.</p> <p>Between 2013 and 2017, the crude incidence rate for colorectal cancer in this tract was <strong>' + (feature.properties.Bladder_O_).toLocaleString('en', {maximumFractionDigits:2}) + ' cases per 1,000 adults</strong> over the age of 18.</p><p style="font-size: 9px;">Data is from the NYS Cancer Registry</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var bladderCrudeLegend = L.control({
    position: "bottomleft"
});
bladderCrudeLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Crude Urinary Bladder</h4>";
    div.innerHTML += "<h4>Cancer Rate</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>per 1,000 adults (18+)</h4>";
    div.innerHTML += '<i style="background: #8c2d04"></i><span>4.89 - 5.38</span><br>';
    div.innerHTML += '<i style="background: #cc4c02"></i><span>3.89 - 4.85</span><br>';
    div.innerHTML += '<i style="background: #ec7014"></i><span>2.92 - 3.88</span><br>';
    div.innerHTML += '<i style="background: #fe9929"></i><span>1.95 - 2.91</span><br>';
    div.innerHTML += '<i style="background: #fec44f"></i><span>0.98 - 1.94</span><br>';
    div.innerHTML += '<i style="background: #fee391"></i><span>0.13 - 0.97</span><br>';
    div.innerHTML += '<i style="background: #ffffd4"></i><span>0</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorBladderCrude(percent) {
    return percent > 4.85 ?
        "#8c2d04" :
        percent > 3.88 ?
        "#cc4c02" :
        percent > 2.91 ?
        "#ec7014" :
        percent > 1.94 ?
        "#fe9929" :
        percent > 0.97 ?
        "#fec44f" :
        percent > 0 ?
        "#fee391" :
        percent == 0 ?
        "#ffffd4" :
        "#606060";
}

function styleBladderCrude(feature) {
    return {
        fillColor: colorBladderCrude(feature.properties.Bladder_O_),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//=========================
// CANCER DRILL DOWN GEOJSON

$.getJSON("cancerDrill.geojson", function(data) {
    breastRatioLayer.addData(data);
    breastCrudeLayer.addData(data);
    colorectalRatioLayer.addData(data);
    colorectalCrudeLayer.addData(data);
    lungRatioLayer.addData(data);
    lungCrudeLayer.addData(data);
    nhlRatioLayer.addData(data);
    nhlCrudeLayer.addData(data);
    prostateRatioLayer.addData(data);
    prostateCrudeLayer.addData(data);
    bladderRatioLayer.addData(data);
    bladderCrudeLayer.addData(data);
});

// LANGUAGE DROPDOWN

var languageDrill = L.control({position: 'topright'});
languageDrill.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="languageDrill"><option selected disabled>Choose a language</option><option>Speakers of Other Languages</option><option>African Languages</option><option>Arabic</option><option>Chinese</option><option>Other Asian Languages</option><option>French Languages</option><option>German</option><option>Greek</option><option>Haitian Creole</option><option>Hebrew</option><option>Indo-European Languages</option><option>Italian</option><option>Polish</option><option>Russian</option><option>Spanish</option><option>Tagalog</option><option>Urdu</option><option>Other Indic Languages</option><option>Yiddish</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick //= L.DomEvent.stopPropagation;
    return div;
};



// CANCER DROPDOWN

var cancerDrill = L.control({position: 'topright'});
cancerDrill.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="cancerDrill"><option selected disabled>Choose a cancer measure</option><option>Breast (Crude)</option><option>Breast (O/E)</option><option>Colorectal (Crude)</option><option>Colorectal (O/E)</option><option>Lung (Crude)</option><option>Lung (O/E)</option><option>Non-Hodgkin Lymphoma (Crude)</option><option>Non-Hodgkin Lymphoma (O/E)</option><option>Prostate (Crude)</option><option>Prostate (O/E)</option><option>Urinary Bladder (Crude)</option><option>Urinary Bladder (O/E)</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick //= L.DomEvent.stopPropagation;
    return div;
};









//=================================================== CONTROL LAYER VISIBILITY =====================================================

// LAYER GROUPS

var demoGroup = {
    "Brooklyn Languages": languageLayer,
    "Population Density": popLayer
}

var outcomesGroup = {
    "Cancer Prevalence": cancerLayer,
    "Coronary Heart Disease": heartDiseaseLayer,
    "Asthma Prevalence": asthmaLayer,
    "High Blood Pressure": bloodPressureLayer,
    "Diabetes Prevalence": diabetesLayer,
    "High Cholestorol": hCholestorolLayer,
    "Chronic Kidney Disease": kidneyLayer
}

var screeningGroup = {
    "Recent Annual Check Up": checkupLayer,
    "Recent Dentist Visits": dentistLayer,
    "Cervical Cancer Screening": cervicalLayer,
    "Mammography Screening": mammogramLayer,
    "Colorectal Cancer Screening" : colorectalLayer
}

var behaviorGroup = {
    "Percent Uninsured": uninsuredLayer,
    "Current Smokers": smokerLayer,
    "Frequent Drinkers": drinkersLayer,
    "Obesity Prevalence": obesityLayer,
    "Sedentary Lifestyle": sedentaryLayer,
    "<7 Hours Sleep": sleepLayer
}

var overlay = {
    "See Zip Code Boundaries": zipGroup,
    "See PUMA Boundaries" : pumaGroup,
    "See NTA Boundaries" : ntaGroup
}

// LAYER CONTROLS

var demographics = L.control.layers(demoGroup, overlay,{
    collapsed:false 
}).addTo(mymap);

var outcomes = L.control.layers(outcomesGroup, overlay,{
    collapsed:false 
})

var screening = L.control.layers(screeningGroup, overlay,{
    collapsed:false 
})

var behaviors = L.control.layers(behaviorGroup, overlay,{
    collapsed:false 
})


languageDrill.addTo(mymap);



// SWITCH LAYERS BASED ON BUTTONS

currentLayerControl = demographics
currentLayer = languageLayer
currentLegend = languageLegend

$("#demographics").click(function() {
	mymap.eachLayer(function (layer) {
	mymap.removeLayer(layer);
	});
	baseLayer.addTo(mymap);
        mymap.removeControl(currentLayerControl);
        mymap.removeControl(cancerDrill);
        mymap.removeControl(currentLegend);
        currentLayer = languageLayer;
        languageLayer.addTo(mymap);
        currentLayerControl = demographics;
        demographics.addTo(mymap);
        currentLegend = languageLegend;
        languageLegend.addTo(mymap);
        languageDrill.addTo(mymap);
	$('#languageDrill').change(function(){
            languageSelect = $("#languageDrill option:selected").text()
            console.log($("#languageDrill option:selected").text());    
            
            if( languageSelect == "Arabic" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = arabicLegend;
                currentLayer = arabicLayer
                arabicLayer.addTo(mymap)
                arabicLegend.addTo(mymap)
            } else if ( languageSelect == "Speakers of Other Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = solLegend;
                currentLayer = solLayer
                solLayer.addTo(mymap)
                solLegend.addTo(mymap)
            } else if ( languageSelect == "African Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = africanLegend;
                currentLayer = africanLayer
                africanLayer.addTo(mymap)
                africanLegend.addTo(mymap)
            } else if ( languageSelect == "Chinese" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = chineseLegend;
                currentLayer = chineseLayer
                chineseLayer.addTo(mymap)
                chineseLegend.addTo(mymap)
            } else if ( languageSelect == "French Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = frenchLegend;
                currentLayer = frenchLayer
                frenchLayer.addTo(mymap)
                frenchLegend.addTo(mymap)
            } else if ( languageSelect == "German" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = germanLegend;
                currentLayer = germanLayer
                germanLayer.addTo(mymap)
                germanLegend.addTo(mymap)
            } else if ( languageSelect == "Greek" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = greekLegend;
                currentLayer = greekLayer
                greekLayer.addTo(mymap)
                greekLegend.addTo(mymap)
            } else if ( languageSelect == "Haitian Creole" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = haitianLegend;
                currentLayer = haitianLayer
                haitianLayer.addTo(mymap)
                haitianLegend.addTo(mymap)
            } else if ( languageSelect == "Hebrew" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = hebrewLegend;
                currentLayer = hebrewLayer
                hebrewLayer.addTo(mymap)
                hebrewLegend.addTo(mymap)
            } else if ( languageSelect == "Italian" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = italianLegend;
                currentLayer = italianLayer
                italianLayer.addTo(mymap)
                italianLegend.addTo(mymap)
            } else if ( languageSelect == "Polish" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = polishLegend;
                currentLayer = polishLayer
                polishLayer.addTo(mymap)
                polishLegend.addTo(mymap)
            } else if ( languageSelect == "Portuguese" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = portugueseLegend;
                currentLayer = portugueseLayer
                portugueseLayer.addTo(mymap)
                portugueseLegend.addTo(mymap)
            } else if ( languageSelect == "Russian" ) {    
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = russianLegend;
                currentLayer = russianLayer
                russianLayer.addTo(mymap)
                russianLegend.addTo(mymap)
            } else if ( languageSelect == "Scandinavian Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = scandinavianLegend;
                currentLayer = scandinavianLayer
                scandinavianLayer.addTo(mymap)
                scandinavianLegend.addTo(mymap)
            } else if ( languageSelect == "Serbo-Croatian" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = serbocroatianLegend;
                currentLayer = serbocroatianLayer
                serbocroatianLayer.addTo(mymap)
                serbocroatianLegend.addTo(mymap)
            } else if ( languageSelect == "Spanish" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = spanishLegend;
                currentLayer = spanishLayer
                spanishLayer.addTo(mymap)
                spanishLegend.addTo(mymap)
            } else if ( languageSelect == "Tagalog" ) {    
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = tagalogLegend;
                currentLayer = tagalogLayer
                tagalogLayer.addTo(mymap)
                tagalogLegend.addTo(mymap)
            } else if ( languageSelect == "Urdu" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = urduLegend;
                currentLayer = urduLayer
                urduLayer.addTo(mymap)
                urduLegend.addTo(mymap)
            } else if ( languageSelect == "Yiddish" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = yiddishLegend;
                currentLayer = yiddishLayer
                yiddishLayer.addTo(mymap)
                yiddishLegend.addTo(mymap)
            } else if ( languageSelect == "Other Asian Languages" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = asianLegend;
                currentLayer = asianLayer
                asianLayer.addTo(mymap)
                asianLegend.addTo(mymap)
            } else if ( languageSelect == "Other Indic Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = indicLegend;
                currentLayer = indicLayer
                indicLayer.addTo(mymap)
                indicLegend.addTo(mymap)
            } else if ( languageSelect == "Indo-European Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = indoeuropeanLegend;
                currentLayer = indoeuropeanLayer
                indoeuropeanLayer.addTo(mymap)
                indoeuropeanLegend.addTo(mymap)
            } else if ( languageSelect == "Other Pacific Island Languages" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = pacificLegend;
                currentLayer = pacificLayer
                pacificLayer.addTo(mymap)
                pacificLegend.addTo(mymap)
            } else if ( languageSelect == "Other Slavic Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = slavicLegend;
                currentLayer = slavicLayer
                slavicLayer.addTo(mymap)
                slavicLegend.addTo(mymap)
            } else if ( languageSelect == "Other West Germanic Languages" ) {    
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = germanicLegend;
                currentLayer = germanicLayer
                germanicLayer.addTo(mymap)
                germanicLegend.addTo(mymap)
            } else if ( languageSelect == "Other and unspecified Languages" ) {    
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = otherLegend;
                currentLayer = otherLayer
                otherLayer.addTo(mymap)
                otherLegend.addTo(mymap)
            } 
        });        
        });
$("#outcomes").click(function() {
    mymap.eachLayer(function (layer) {
    mymap.removeLayer(layer);
});
baseLayer.addTo(mymap);
        currentLayer = cancerLayer;
        cancerLayer.addTo(mymap);
        mymap.removeControl(currentLayerControl);
        mymap.removeControl(languageDrill);
        currentLayerControl = outcomes;
        outcomes.addTo(mymap);
        mymap.removeControl(currentLegend);
        currentLegend = cancerLegend;
        cancerLegend.addTo(mymap);
        cancerDrill.addTo(mymap);
        $('#cancerDrill').change(function(){
    cancerSelect = $("#cancerDrill option:selected").text()
    console.log($("#cancerDrill option:selected").text());    

    if( cancerSelect == "Breast (Crude)" ) {
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = breastCrudeLegend;
        currentLayer = breastCrudeLayer
        breastCrudeLayer.addTo(mymap)
        breastCrudeLegend.addTo(mymap)
    } else if ( cancerSelect == "Breast (O/E)" ) {
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = breastRatioLegend;
        currentLayer = breastRatioLayer
        breastRatioLayer.addTo(mymap)
        breastRatioLegend.addTo(mymap)
    } else if ( cancerSelect == "Colorectal (Crude)" ) {
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = colorectalCrudeLegend;
        currentLayer = colorectalCrudeLayer
        colorectalCrudeLayer.addTo(mymap)
        colorectalCrudeLegend.addTo(mymap)
    } else if ( cancerSelect == "Colorectal (O/E)" ) { 
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = colorectalRatioLegend;
        currentLayer = colorectalRatioLayer
        colorectalRatioLayer.addTo(mymap)
        colorectalRatioLegend.addTo(mymap)
    } else if( cancerSelect == "Lung (Crude)" ) {
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = lungCrudeLegend;
        currentLayer = lungCrudeLayer
        lungCrudeLayer.addTo(mymap)
        lungCrudeLegend.addTo(mymap)
    } else if ( cancerSelect == "Lung (O/E)" ) {
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = lungRatioLegend;
        currentLayer = lungRatioLayer
        lungRatioLayer.addTo(mymap)
        lungRatioLegend.addTo(mymap)
    } else if ( cancerSelect == "Non-Hodgkin Lymphoma (Crude)" ) {
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = nhlCrudeLegend;
        currentLayer = nhlCrudeLayer
        nhlCrudeLayer.addTo(mymap)
        nhlCrudeLegend.addTo(mymap)
    } else if ( cancerSelect == "Non-Hodgkin Lymphoma (O/E)" ) { 
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = nhlRatioLegend;
        currentLayer = nhlRatioLayer
        nhlRatioLayer.addTo(mymap)
        nhlRatioLegend.addTo(mymap)
    }  else if ( cancerSelect == "Prostate (Crude)" ) {
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = prostateCrudeLegend;
        currentLayer = prostateCrudeLayer
        prostateCrudeLayer.addTo(mymap)
        prostateCrudeLegend.addTo(mymap)
    } else if ( cancerSelect == "Prostate (O/E)" ) { 
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = prostateRatioLegend;
        currentLayer = prostateRatioLayer
        prostateRatioLayer.addTo(mymap)
        prostateRatioLegend.addTo(mymap)
    } else if ( cancerSelect == "Urinary Bladder (Crude)" ) {
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = bladderCrudeLegend;
        currentLayer = bladderCrudeLayer
        bladderCrudeLayer.addTo(mymap)
        bladderCrudeLegend.addTo(mymap)
    } else if ( cancerSelect == "Urinary Bladder (O/E)" ) { 
        mymap.removeLayer(currentLayer)
        mymap.removeControl(currentLegend);
        currentLegend = bladderRatioLegend;
        currentLayer = bladderRatioLayer
        bladderRatioLayer.addTo(mymap)
        bladderRatioLegend.addTo(mymap)
    }
        });
        });
$("#screening").click(function() {
	mymap.eachLayer(function (layer) {
	mymap.removeLayer(layer);
	});
	baseLayer.addTo(mymap);
        currentLayer = checkupLayer;
        checkupLayer.addTo(mymap);
        mymap.removeControl(currentLayerControl);
        mymap.removeControl(languageDrill);
        mymap.removeControl(cancerDrill);
        currentLayerControl = screening;
        screening.addTo(mymap);
        mymap.removeControl(currentLegend);
        currentLegend = checkLegend;
        checkLegend.addTo(mymap);
        });
$("#unhealthy").click(function() {
	mymap.eachLayer(function (layer) {
	mymap.removeLayer(layer);
	});
	baseLayer.addTo(mymap);
        currentLayer = uninsuredLayer;
        uninsuredLayer.addTo(mymap);
        mymap.removeControl(currentLayerControl);
        mymap.removeControl(languageDrill);
        mymap.removeControl(cancerDrill);
        currentLayerControl = behaviors;
        behaviors.addTo(mymap);
        mymap.removeControl(currentLegend);
        currentLegend = uninsuredLegend;
        uninsuredLegend.addTo(mymap);
        });


//SWITCH LEGENDS
mymap.on('baselayerchange', function(eventLayer) {
    if (eventLayer.name === "Brooklyn Languages") {
        mymap.removeControl(currentLegend);
//        mymap.removeLayer(currentLayer);
        currentLegend = languageLegend;
        currentLayer = languageLayer;
	languageLayer.addTo(mymap);
        languageLegend.addTo(mymap);
        languageDrill.addTo(mymap);
$('#languageDrill').change(function(){
            languageSelect = $("#languageDrill option:selected").text()
            console.log($("#languageDrill option:selected").text());    
            
            if( languageSelect == "Arabic" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = arabicLegend;
                currentLayer = arabicLayer
                arabicLayer.addTo(mymap)
                arabicLegend.addTo(mymap)
            } else if ( languageSelect == "Speakers of Other Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = solLegend;
                currentLayer = solLayer
                solLayer.addTo(mymap)
                solLegend.addTo(mymap)
            } else if ( languageSelect == "African Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = africanLegend;
                currentLayer = africanLayer
                africanLayer.addTo(mymap)
                africanLegend.addTo(mymap)
            } else if ( languageSelect == "Chinese" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = chineseLegend;
                currentLayer = chineseLayer
                chineseLayer.addTo(mymap)
                chineseLegend.addTo(mymap)
            } else if ( languageSelect == "French Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = frenchLegend;
                currentLayer = frenchLayer
                frenchLayer.addTo(mymap)
                frenchLegend.addTo(mymap)
            } else if ( languageSelect == "German" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = germanLegend;
                currentLayer = germanLayer
                germanLayer.addTo(mymap)
                germanLegend.addTo(mymap)
            } else if ( languageSelect == "Greek" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = greekLegend;
                currentLayer = greekLayer
                greekLayer.addTo(mymap)
                greekLegend.addTo(mymap)
            } else if ( languageSelect == "Haitian Creole" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = haitianLegend;
                currentLayer = haitianLayer
                haitianLayer.addTo(mymap)
                haitianLegend.addTo(mymap)
            } else if ( languageSelect == "Hebrew" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = hebrewLegend;
                currentLayer = hebrewLayer
                hebrewLayer.addTo(mymap)
                hebrewLegend.addTo(mymap)
            } else if ( languageSelect == "Italian" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = italianLegend;
                currentLayer = italianLayer
                italianLayer.addTo(mymap)
                italianLegend.addTo(mymap)
            } else if ( languageSelect == "Polish" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = polishLegend;
                currentLayer = polishLayer
                polishLayer.addTo(mymap)
                polishLegend.addTo(mymap)
            } else if ( languageSelect == "Portuguese" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = portugueseLegend;
                currentLayer = portugueseLayer
                portugueseLayer.addTo(mymap)
                portugueseLegend.addTo(mymap)
            } else if ( languageSelect == "Russian" ) {    
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = russianLegend;
                currentLayer = russianLayer
                russianLayer.addTo(mymap)
                russianLegend.addTo(mymap)
            } else if ( languageSelect == "Scandinavian Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = scandinavianLegend;
                currentLayer = scandinavianLayer
                scandinavianLayer.addTo(mymap)
                scandinavianLegend.addTo(mymap)
            } else if ( languageSelect == "Serbo-Croatian" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = serbocroatianLegend;
                currentLayer = serbocroatianLayer
                serbocroatianLayer.addTo(mymap)
                serbocroatianLegend.addTo(mymap)
            } else if ( languageSelect == "Spanish" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = spanishLegend;
                currentLayer = spanishLayer
                spanishLayer.addTo(mymap)
                spanishLegend.addTo(mymap)
            } else if ( languageSelect == "Tagalog" ) {    
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = tagalogLegend;
                currentLayer = tagalogLayer
                tagalogLayer.addTo(mymap)
                tagalogLegend.addTo(mymap)
            } else if ( languageSelect == "Urdu" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = urduLegend;
                currentLayer = urduLayer
                urduLayer.addTo(mymap)
                urduLegend.addTo(mymap)
            } else if ( languageSelect == "Yiddish" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = yiddishLegend;
                currentLayer = yiddishLayer
                yiddishLayer.addTo(mymap)
                yiddishLegend.addTo(mymap)
            } else if ( languageSelect == "Other Asian Languages" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = asianLegend;
                currentLayer = asianLayer
                asianLayer.addTo(mymap)
                asianLegend.addTo(mymap)
            } else if ( languageSelect == "Other Indic Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = indicLegend;
                currentLayer = indicLayer
                indicLayer.addTo(mymap)
                indicLegend.addTo(mymap)
            } else if ( languageSelect == "Indo-European Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = indoeuropeanLegend;
                currentLayer = indoeuropeanLayer
                indoeuropeanLayer.addTo(mymap)
                indoeuropeanLegend.addTo(mymap)
            } else if ( languageSelect == "Other Pacific Island Languages" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = pacificLegend;
                currentLayer = pacificLayer
                pacificLayer.addTo(mymap)
                pacificLegend.addTo(mymap)
            } else if ( languageSelect == "Other Slavic Languages" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = slavicLegend;
                currentLayer = slavicLayer
                slavicLayer.addTo(mymap)
                slavicLegend.addTo(mymap)
            } else if ( languageSelect == "Other West Germanic Languages" ) {    
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = germanicLegend;
                currentLayer = germanicLayer
                germanicLayer.addTo(mymap)
                germanicLegend.addTo(mymap)
            } else if ( languageSelect == "Other and unspecified Languages" ) {    
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = otherLegend;
                currentLayer = otherLayer
                otherLayer.addTo(mymap)
                otherLegend.addTo(mymap)
            }
	});        
    } else if (eventLayer.name === "Cancer Prevalence") { 
        mymap.removeControl(currentLegend);
        currentLegend = cancerLegend;
        currentLayer = cancerLayer;
	cancerLayer.addTo(mymap);
        cancerLegend.addTo(mymap);
        cancerDrill.addTo(mymap);

        $('#cancerDrill').change(function(){
            cancerSelect = $("#cancerDrill option:selected").text()
            console.log($("#cancerDrill option:selected").text());    

            if( cancerSelect == "Breast (Crude)" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = breastCrudeLegend;
                currentLayer = breastCrudeLayer
                breastCrudeLayer.addTo(mymap)
                breastCrudeLegend.addTo(mymap)
            } else if ( cancerSelect == "Breast (O/E)" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = breastRatioLegend;
                currentLayer = breastRatioLayer
                breastRatioLayer.addTo(mymap)
                breastRatioLegend.addTo(mymap)
            } else if ( cancerSelect == "Colorectal (Crude)" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = colorectalCrudeLegend;
                currentLayer = colorectalCrudeLayer
                colorectalCrudeLayer.addTo(mymap)
                colorectalCrudeLegend.addTo(mymap)
            } else if ( cancerSelect == "Colorectal (O/E)" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = colorectalRatioLegend;
                currentLayer = colorectalRatioLayer
                colorectalRatioLayer.addTo(mymap)
                colorectalRatioLegend.addTo(mymap)
            } else if( cancerSelect == "Lung (Crude)" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = lungCrudeLegend;
                currentLayer = lungCrudeLayer
                lungCrudeLayer.addTo(mymap)
                lungCrudeLegend.addTo(mymap)
            } else if ( cancerSelect == "Lung (O/E)" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = lungRatioLegend;
                currentLayer = lungRatioLayer
                lungRatioLayer.addTo(mymap)
                lungRatioLegend.addTo(mymap)
            } else if ( cancerSelect == "Non-Hodgkin Lymphoma (Crude)" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = nhlCrudeLegend;
                currentLayer = nhlCrudeLayer
                nhlCrudeLayer.addTo(mymap)
                nhlCrudeLegend.addTo(mymap)
            } else if ( cancerSelect == "Non-Hodgkin Lymphoma (O/E)" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = nhlRatioLegend;
                currentLayer = nhlRatioLayer
                nhlRatioLayer.addTo(mymap)
                nhlRatioLegend.addTo(mymap)
            }  else if ( cancerSelect == "Prostate (Crude)" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = prostateCrudeLegend;
                currentLayer = prostateCrudeLayer
                prostateCrudeLayer.addTo(mymap)
                prostateCrudeLegend.addTo(mymap)
            } else if ( cancerSelect == "Prostate (O/E)" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = prostateRatioLegend;
                currentLayer = prostateRatioLayer
                prostateRatioLayer.addTo(mymap)
                prostateRatioLegend.addTo(mymap)
            } else if ( cancerSelect == "Urinary Bladder (Crude)" ) {
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = bladderCrudeLegend;
                currentLayer = bladderCrudeLayer
                bladderCrudeLayer.addTo(mymap)
                bladderCrudeLegend.addTo(mymap)
            } else if ( cancerSelect == "Urinary Bladder (O/E)" ) { 
                mymap.removeLayer(currentLayer)
                mymap.removeControl(currentLegend);
                currentLegend = bladderRatioLegend;
                currentLayer = bladderRatioLayer
                bladderRatioLayer.addTo(mymap)
                bladderRatioLegend.addTo(mymap)
                } 
        });
    } else if (eventLayer.name === "Current Smokers") { 
        mymap.removeControl(currentLegend);
        currentLegend = smokeLegend;
        smokeLegend.addTo(mymap);
    } else if (eventLayer.name === "Coronary Heart Disease") { 
        mymap.removeControl(currentLegend);
        mymap.removeControl(cancerDrill);
        currentLegend = heartLegend;
        heartLegend.addTo(mymap);
    } else if (eventLayer.name === "Recent Annual Check Up") { 
        mymap.removeControl(currentLegend);
        currentLegend = checkLegend;
        checkLegend.addTo(mymap);
    } else if (eventLayer.name === "Recent Dentist Visits") { 
        mymap.removeControl(currentLegend);
        currentLegend = dentistLegend;
        dentistLegend.addTo(mymap);
    } else if (eventLayer.name === "Diabetes Prevalence") { 
        mymap.removeControl(currentLegend);
        mymap.removeControl(cancerDrill);
        currentLegend = diabetesLegend;
        diabetesLegend.addTo(mymap);
    } else if (eventLayer.name === "High Cholestorol") { 
        mymap.removeControl(currentLegend);
        mymap.removeControl(cancerDrill);
        currentLegend = cholestorolLegend;
        cholestorolLegend.addTo(mymap);
    } else if (eventLayer.name === "Chronic Kidney Disease") { 
        mymap.removeControl(currentLegend);
        mymap.removeControl(cancerDrill);
        currentLegend = kidneyLegend;
        kidneyLegend.addTo(mymap);
    } else if (eventLayer.name === "Sedentary Lifestyle") { 
        mymap.removeControl(currentLegend);
        currentLegend = inactiveLegend;
        inactiveLegend.addTo(mymap);
    } else if (eventLayer.name === "Mammography Screening") { 
        mymap.removeControl(currentLegend);
        currentLegend = mammoLegend;
        mammoLegend.addTo(mymap);
    } else if (eventLayer.name === "Obesity Prevalence") { 
        mymap.removeControl(currentLegend);
        currentLegend = obeseLegend;
        obeseLegend.addTo(mymap);
    } else if (eventLayer.name === "<7 Hours Sleep") { 
        mymap.removeControl(currentLegend);
        currentLegend = sleepLegend;
        sleepLegend.addTo(mymap);
    } else if (eventLayer.name === "Uninsured") { 
        mymap.removeControl(currentLegend);
        currentLegend = uninsuredLegend;
        uninsuredLegend.addTo(mymap);
    } else if (eventLayer.name === "Cervical Cancer Screening") { 
        mymap.removeControl(currentLegend);
        currentLegend = cervicalLegend;
        cervicalLegend.addTo(mymap);
    } else if (eventLayer.name === "Asthma Prevalence") { 
        mymap.removeControl(currentLegend);
        mymap.removeControl(cancerDrill);
        currentLegend = asthmaLegend;
        asthmaLegend.addTo(mymap);
    } else if (eventLayer.name === "High Blood Pressure") { 
        mymap.removeControl(currentLegend);
        mymap.removeControl(cancerDrill);
        currentLegend = bpLegend;
        bpLegend.addTo(mymap);
    } else if (eventLayer.name === "Frequent Drinkers") { 
        mymap.removeControl(currentLegend);
        currentLegend = drinkLegend;
        drinkLegend.addTo(mymap);
    } else if (eventLayer.name === "Population Density") { 
        mymap.removeControl(currentLegend);
	mymap.removeControl(languageDrill);
        currentLegend = popLegend;
        popLegend.addTo(mymap);
    } else if (eventLayer.name === "Colorectal Cancer Screening") { 
        mymap.removeControl(currentLegend);
        currentLegend = colorectalLegend;
        colorectalLegend.addTo(mymap);
    }
});

//update 4.28.253