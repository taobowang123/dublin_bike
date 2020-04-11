// Init station dropDown button.
function init_station_dropdown() {
    $.getJSON("http://127.0.0.1:5000/stations", null, function (data) {
            if ('stations' in data) {
                var options_station = "<option>station select</option>";
                var stations = data.stations;
                //sort by the alphabetical order
                stations.sort(function(a,b){
                    return a.name.localeCompare(b.name);
                });
                stations.forEach(function (station) {
                    options_station += "<option value=" + station.id + ">" + station.name + "</option>";
                })
                document.getElementById("station-dropdown").innerHTML = options_station;
            }
        })
        .done(function () {
            console.log("dropdown second success");
        })
        .fail(function () {
            console.log("dropdown error");
        })
        .always(function () {
            console.log("dropdown complete");
        })
}

//when select dropdown button....
function select_dropdown(){
    var station_id = document.getElementById("station-dropdown").value;
//  when click the marker, the chart will be shown
    drawWeekChart(station_id);
    drawHourChart(station_id);
}

// Initialize and add the map
// declare constants and global variables
const chart_colors = ['#59b75c', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'];
const backgroundColor = '#fff';
//init setup the google map
function initMap() {
    // The location of dublin
    var dublin = {
        lat: 53.35,
        lng: -6.26
    };
    // The map, centered at dublin
    var map = new google.maps.Map(
        document.getElementById('map_location'), {
            zoom: 13,
            center: dublin,
            mapTypeId: 'roadmap'
        });
    //bike layer, show the bicycling route situation
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
    //get data from bikes api~~~~
    var result = [];
    $.getJSON("http://127.0.0.1:5000/stations", null, function (data) {
            if ('stations' in data) {
                var stations = data.stations;
                stations.forEach(function (station) {
                    var station_id = station.id;
                    var marker = new google.maps.Marker({
                        position: {
                            lat: station.position_lat,
                            lng: station.position_lng
                        },
                        map: map,
                        title: station.name,
                        station_id: station.id
                    });
                    //add marker listener
                    marker.addListener('click', function () {
                        // when click the marker, the chart will be shown
                        drawWeekChart(station_id);
                        drawHourChart(station_id);
                        var contentString = '<div id="content">';
                        contentString +=
                            '<p>station\'s name:' + station.name + '</p>' +
                            '<p>station\'s id:' + station.id + '</p>' +
                            '<p>station\'s address:' + station.address + '</p>' +
                            '<p>station\'s banking:' + station.banking + '</p>' +
                            '<p>station\'s bonus:' + station.bonus + '</p>';
                        contentString2 = get_available_info(contentString, station_id);
                    });
                    //get available bikes and stands information
                    function get_available_info(contentString, station_id) {
                        $.getJSON("http://127.0.0.1:5000/available/" + station_id, function (data) {
                                if ('available_info' in data) {
                                    var available_info = data.available_info;
                                    var available_bike_stands = available_info[0].available_bike_stands;
                                    var available_bikes = available_info[0].available_bikes;
                                    contentString +=
                                        '<p>station\'s available_bike_stands:' + available_bike_stands + '</p>' +
                                        '<p>station\'s available_bikes:' + available_bikes + '</p>' +
                                        '</div>';
                                    var infowindow = new google.maps.InfoWindow({
                                        content: contentString
                                    });
                                    map.setZoom(15);
                                    map.panTo(marker.getPosition());
                                    infowindow.open(map, marker);
                                }
                            })
                            .done(function () {
                                console.log("get available information second success");
                            })
                            .fail(function () {
                                console.log("get available information error");
                            })
                            .always(function () {
                                console.log("get available information complete");
                            })
                    }
                })
            }
        })
        .done(function () {
            console.log("marker second success");
        })
        .fail(function () {
            console.log("marker error");
        })
        .always(function () {
            console.log("marker complete");
        })
}

// Load the Visualization API and the corechart package.
google.charts.load('current', {
    'packages': ['corechart']
});
//// Set a callback to run when the Google Visualization API is loaded.
//google.charts.setOnLoadCallback(drawWeekChart);

function drawWeekChart(station_id) {
    $.getJSON("http://127.0.0.1:5000/station_occupancy_weekly/"+ station_id, null, function (data) {
            if ('available_bikes' in data) {
                var available_bikes = data.available_bikes;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'weekday');
                data.addColumn('number', 'available bikes');
                data.addRows([
                      ['Mon', available_bikes['Mon']],
                      ['Tue', available_bikes['Tue']],
                      ['Wed', available_bikes['Wed']],
                      ['Thurs', available_bikes['Thurs']],
                      ['Fri', available_bikes['Fri']],
                      ['Sat', available_bikes['Sat']],
                      ['Sun', available_bikes['Sun']],
                ]);
                var options = {
                    chart: {
                        title: 'Bikes vs. Time',
                        subtitle: 'Weekly display of available bikes'
                    },
                    height: 300,
                    legend: {
                        position: 'top',
                        maxLines: 3
                    },
                    animation: {
                        duration: 1000,
                        easing: 'out'
                    },
                    colors: chart_colors,
                    bar: {
                        groupWidth: '75%'
                    },
                    isStacked: true,
                    backgroundColor: backgroundColor
                };
                var chart = new google.visualization.ColumnChart(document.getElementById('weekChart'));
                chart.draw(data, options);
            }
        })
        .done(function () {
            console.log("week available bikes second success");
        })
        .fail(function () {
            console.log("week available bikes error");
        })
        .always(function () {
            console.log("week available bikes complete");
        })
}
//draw hour available bike chart
function drawHourChart(station_id) {
    $.getJSON("http://127.0.0.1:5000/station_occupancy_hourly/"+station_id, null, function (data) {
            if ('available_bikes' in data) {
                var available_bikes = data.available_bikes;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'hours');
                data.addColumn('number', 'available bikes');
                data.addRows([
                  ['0', available_bikes["0"]],
                  ['1', available_bikes["1"]],
                  ['2', available_bikes["2"]],
                  ['3', available_bikes["3"]],
                  ['4', available_bikes["4"]],
                  ['5', available_bikes["5"]],
                  ['6', available_bikes["6"]],
                  ['7', available_bikes["7"]],
                  ['8', available_bikes["8"]],
                  ['9', available_bikes["9"]],
                  ['10', available_bikes["10"]],
                  ['11', available_bikes["11"]],
                  ['12', available_bikes["12"]],
                  ['13', available_bikes["13"]],
                  ['14', available_bikes["14"]],
                  ['15', available_bikes["15"]],
                  ['16', available_bikes["16"]],
                  ['17', available_bikes["17"]],
                  ['18', available_bikes["18"]],
                  ['19', available_bikes["19"]],
                  ['20', available_bikes["20"]],
                  ['21', available_bikes["21"]],
                  ['22', available_bikes["22"]],
                  ['23', available_bikes["23"]],
                ]);
                var options = {
                    chart: {
                        title: 'Bikes vs. Time',
                        subtitle: 'hourly display of available bikes'
                    },
                    height: 300,
                    legend: {
                        position: 'top',
                        maxLines: 3
                    },
                    animation: {
                        duration: 1000,
                        easing: 'out'
                    },
                    colors: chart_colors,
                    bar: {
                        groupWidth: '75%'
                    },
                    isStacked: true,
                    backgroundColor: backgroundColor
                };
                var chart = new google.visualization.ColumnChart(document.getElementById('hourChart'));
                chart.draw(data, options);
            }
        })
        .done(function () {
            console.log("hour available bikes second success");
        })
        .fail(function () {
            console.log("hour available bikes error");
        })
        .always(function () {
            console.log("hour available bikes complete");
        })
}

// Request for prediction data
function predict_bikes() {
    var station_id = document.getElementById("station-dropdown").value;
    var date = document.getElementById("predict-date").value;
    var time = document.getElementById("predict-time").value;
    var requirements = document.getElementsByName("requirement");
    console.log(requirements);
    var requirement = "";
    for (i = 0; i < requirements.length; i++) {
        if (requirements[i].checked) {
            requirement = requirements[i].value;
        }
    }
    $.getJSON("http://127.0.0.1:5000/predic/" + station_id + "/"
        + requirement + "/" + date + "/" + time, function (data) {
        document.getElementById("available-bikes").innerHTML = data;
    })
    .done(function () {
        console.log("predict_bikes second success");
    })
    .fail(function () {
        console.log("predict_bikes error");
    })
    .always(function () {
        console.log("predict_bikes complete");
    })
}
