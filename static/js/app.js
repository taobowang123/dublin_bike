// Init station dropDown.
function init_station_dropdown() {
    $.getJSON("http://127.0.0.1:5000/stations", null, function (data) {
            if ('stations' in data) {
                var options_station = "";
                var stations = data.stations;
                stations.forEach(function (station) {
                    options_station += "<option value=" + station.id + ">" + station.name + "</option>";
                })
                document.getElementById("station-dropdown").innerHTML = options_station;
            }
        })
        .done(function () {
            console.log("second success");
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        })
}


// Initialize and add the map
// declare constants and global variables
st_number = 0;
const chart_colors = ['#59b75c', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'];
const backgroundColor = '#fff';
var icon;
var heatmap;


//init setup the google map
function initMap() {

    // The location of dublin
    var dublin = {
        lat: 53.3575945,
        lng: -6.2613842
    };

    // The map, centered at dublin
    var map = new google.maps.Map(
        document.getElementById('map_location'), {
            zoom: 12,
            center: dublin,
            mapTypeId: 'roadmap'
        });
    console.log("it works 1");

    //bike layer, show the bicycling route situation
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    //get data from bikes api~~~~
    var result = [];
    $.getJSON("http://127.0.0.1:5000/stations", null, function (data) {
            if ('stations' in data) {
                console.log("it works 2");
                var stations = data.stations;
                stations.forEach(function (station) {
                    console.log("it works 3");
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

                    marker.addListener('click', function () {

                        var contentString = '<div id="content">';
                        contentString +=
                            '<p>station\'s name:' + station.name + '</p>' +
                            '<p>station\'s id:' + station.id + '</p>' +
                            '<p>station\'s address:' + station.address + '</p>' +
                            '<p>station\'s banking:' + station.banking + '</p>' +
                            '<p>station\'s bonus:' + station.bonus + '</p>';

                        console.log("here 123345");
                        contentString2 = get_available_info(contentString, station_id);

                    });


                    function get_available_info(contentString, station_id) {

                        console.log(station_id);
                        $.getJSON("http://127.0.0.1:5000/available/" + station_id, function (data) {
                                console.log(station_id);
                                console.log("it works 5");
                                if ('available_info' in data) {
                                    console.log("hello");
                                    var available_info = data.available_info;
                                    var available_bike_stands = available_info[0].available_bike_stands;
                                    var available_bikes = available_info[0].available_bikes;
                                    console.log(available_info);
                                    console.log("here:" + available_bike_stands);
                                    console.log("here:" + available_bikes);
                                    contentString +=
                                        '<p>station\'s available_bike_stands:' + available_bike_stands + '</p>' +
                                        '<p>station\'s available_bikes:' + available_bikes + '</p>' +
                                        '</div>';
                                    console.log("2:" + contentString);
                                    console.log("it works 6");

                                    console.log(contentString);
                                    console.log("it works 7");
                                    var infowindow = new google.maps.InfoWindow({
                                        content: contentString
                                    });
                                    map.setZoom(15);
                                    map.panTo(marker.getPosition());
                                    infowindow.open(map, marker);

                                }
                            })
                            .done(function () {
                                console.log("second success");
                            })
                            .fail(function () {
                                console.log("error");
                            })
                            .always(function () {
                                console.log("complete");
                            })
                    }
                })
            }
        })
        .done(function () {
            console.log("second success");
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        })
}

// Load the Visualization API and the corechart package.
google.charts.load('current', {
    'packages': ['corechart']
});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawWeekChart);

function drawWeekChart() {
    $.getJSON("http://127.0.0.1:5000/station_occupancy_weekly/43", null, function (data) {

            if ('available_bike_stands' in data) {
                console.log("hahaha");
                var available_bike_stands = data.available_bike_stands;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'weekday');
                data.addColumn('number', 'available bike stands');
                data.addRows([
          ['Mon', available_bike_stands['Mon']],
          ['Tue', available_bike_stands['Tue']],
          ['Wed', available_bike_stands['Wed']],
          ['Thurs', available_bike_stands['Thurs']],
          ['Fri', available_bike_stands['Fri']],
          ['Sat', available_bike_stands['Sat']],
          ['Sun', available_bike_stands['Sun']],
        ]);
                var options = {
                    chart: {
                        title: 'Bikes vs. Time',
                        subtitle: 'Weekly display of available bikes'
                    },
                    height: 400,
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
                var chart = new google.visualization.ColumnChart(document.getElementById('charttest'));
                chart.draw(data, options);
            }
        })
        .done(function () {
            console.log("second success");
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        })
}

function drawHourChart() {
    $.getJSON("http://127.0.0.1:5000/station_occupancy_hourly/42", null, function (data) {

            if ('available_bike_stands' in data) {
                console.log("hahaha");
                var available_bike_stands = data.available_bike_stands;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'hours');
                data.addColumn('number', 'available bike stands');
                data.addRows([
          ['0', available_bike_stands["0"]],
          ['1', available_bike_stands["1"]],
          ['2', available_bike_stands["2"]],
          ['3', available_bike_stands["3"]],
          ['4', available_bike_stands["4"]],
          ['5', available_bike_stands["5"]],
          ['6', available_bike_stands["6"]],
          ['7', available_bike_stands["7"]],
          ['8', available_bike_stands["8"]],
          ['9', available_bike_stands["9"]],
          ['10', available_bike_stands["10"]],
          ['11', available_bike_stands["11"]],
          ['12', available_bike_stands["12"]],
          ['13', available_bike_stands["13"]],
          ['14', available_bike_stands["14"]],
          ['15', available_bike_stands["15"]],
          ['16', available_bike_stands["16"]],
          ['17', available_bike_stands["17"]],
          ['18', available_bike_stands["18"]],
          ['19', available_bike_stands["19"]],
          ['20', available_bike_stands["20"]],
          ['21', available_bike_stands["21"]],
          ['22', available_bike_stands["22"]],

        ]);
                var options = {
                    chart: {
                        title: 'Bikes vs. Time',
                        subtitle: 'Weekly display of available bikes'
                    },
                    height: 400,
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
                var chart = new google.visualization.ColumnChart(document.getElementById('charttest'));
                chart.draw(data, options);
            }
        })
        .done(function () {
            console.log("second success");
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        })
}


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
        console.log(data);
        document.getElementById("available-bikes").innerHTML = data;
    })
    .done(function () {
        console.log("second success");
    })
    .fail(function () {
        console.log("error");
    })
    .always(function () {
        console.log("complete");
    })
}
