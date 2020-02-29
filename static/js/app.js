// Initialize and add the map
// declare constants and global variables
var infoWindow;
st_number = 0;
const chart_colors = ['#59b75c', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'];
const backgroundColor = '#fff';
var icon;
var heatmap;

function initMap() {
    // The location of dublin
    var dublin = {
        lat: 53.3575945,
        lng: -6.2613842
    };
    // The map, centered at dublin
    var map = new google.maps.Map(
        document.getElementById('map_location'), {
            zoom: 10,
            center: dublin,
            mapTypeId: 'roadmap'
        });
    var marker = new google.maps.Marker({
        position: dublin,
        map: map
    });

    $.getJSON("http://127.0.0.1:5000/stations", null, function (data) {
        if ('stations' in data) {
            console.log(stations);
            var stations = data.stations;
            _.forEach(stations, function (station) {
                var marker = new google.maps.marker({
                    position: {
                        lat: station.position_lat,
                        lng: station.position_lng
                    },
                    map: map,
                    title: station.name,
                    station_number: station.number
                });
//                marker.addEventListener("click", fnction() {
//                    drawsStationChartsWeekly(this);
//                });
            });
        }
    });
    //
    //    // The marker, positioned at dublin
    //    var bikeLayer = new google.maps.BicyclingLayer();
    //    bikeLayer.setMap(map);
    //    var result;
    //    $.ajax({
    //        url: 'https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=0bef7f2fab41ef8a396b1e3ab0c929ac8138e3e1',
    //        dataType: "json",
    //        success: function (data) {
    //            var result = [];
    //            var weight_point;
    //
    //            // create new spot for heatmap for stations with less than 5 bikes available
    //            for (var i = 0; i < data.length; i++) {
    //                console.log(data);
    //                if (data[i].bike_stands >= 40)
    //                    weight_point = 0.2;
    //                else {
    //                    weight_point = 1;
    //                }
    //                result.push({
    //                    location: new google.maps.LatLng(data[i].position.lat, data[i].position.lng),
    //                    weight: weight_point
    //                });
    //            }
    //            // draw the heatmap
    //            heatmap = new google.maps.visualization.HeatmapLayer({
    //                data: result,
    //                map: map,
    //                radius: 15
    //            });
    //        }
    //    });
    //            // ============================
    //            infoWindow = new google.maps.InfoWindow();
    //            google.maps.event.addListener(map, 'click', function () {
    //                infoWindow.close();
    //            });
    //    
    //            function show_stations(station_data) {
    //                // function to show station markers at correct position on the map.
    //                var bounds = new google.maps.LatLngBounds();
    //    
    //                // iterate over the data creating different colour icons depending on bike usage.
    //                for (var i = 0; i < station_data.length; i++) {
    //                    var dropDownElement = document.createElement('a');
    //                    var latlng = new google.maps.LatLng(station_data[i].position_lat, station_data[i].position_long);
    //                    if (station_data[i].available_bikes >= 20) {
    //                        icon = "http://labs.google.com/ridefinder/images/mm_20_green.png"
    //                    } else if (station_data[i].available_bikes >= 10 && station_data[i].available_bikes < 20) {
    //                        icon = "http://labs.google.com/ridefinder/images/mm_20_yellow.png"
    //                    } else {
    //                        icon = "http://labs.google.com/ridefinder/images/mm_20_red.png"
    //                    }
    //                    createMarker(latlng,
    //                        station_data[i].name,
    //                        station_data[i].address,
    //                        station_data[i].number,
    //                        station_data[i].last_update,
    //                        station_data[i].available_bikes,
    //                        station_data[i].available_bike_stands);
    //                    bounds.extend(latlng);
    //    
    //                    dropDownElement.onclick = click_list(station_data[i].number, latlng);
    //                    dropDownElement.innerHTML = station_data[i].address;
    //                    dropDownElement.class = "station-list";
    //                    document.getElementById("myDropdown").appendChild(dropDownElement);
    //                }
    //                map.fitBounds(bounds);
    //                map.setZoom(13);
    //    
    //    
    //            }
    //    
    //            get_data(show_stations, "stations");
    //            // show_stations is a callback functions for get_data
    //            // so this essentially runs show_stations(get_data(stations))
    //    
    //            function createMarker(latlng, name, address, st_number, last_update, available_bikes, available_bike_stands) {
    //                // all the javascript for creating the info box. The info box appears when a pin is clicked.
    //                var marker = new google.maps.Marker({
    //                    map: map,
    //                    position: latlng,
    //                    title: name,
    //                    icon: icon
    //                });
    //                google.maps.event.addListener(marker, 'click', function () {
    //                    document.st_number = st_number;
    //                    var info_box_content = '<div class="info_box">' +
    //                        '<div class="info_box_title" onclick="return click_marker(' + st_number + ');">' +
    //                        '<a href="#chart_boxes"><center>' + name + '</center></a></div><hr>' +
    //                        '<p> Last update: ' + last_update + '</p>' +
    //                        '<div id="donut_single"></div>';
    //    
    //                    infoWindow.setContent(info_box_content);
    //                    infoWindow.open(map, marker);
    //    
    //                    var data = google.visualization.arrayToDataTable([
    //                    ['Bikes', 'Bikes', 'Stands'],
    //                    ['', available_bikes, available_bike_stands]
    //                ]);
    //    
    //                    var options = {
    //                        chartArea: {
    //                            width: '50%',
    //                            height: '60%'
    //                        },
    //                        colors: chart_colors,
    //                        isStacked: true,
    //                        hAxis: {
    //                            minValue: 0,
    //                        },
    //    
    //                    };
    //                    var chart = new google.visualization.BarChart(document.getElementById('donut_single'));
    //                    chart.draw(data, options);
    //    
    //                });
    //            }
    //    
    //            google.charts.load('current', {
    //                packages: ['corechart', 'bar', 'line']
    //            });
    //        
}