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
                    });
                }

            })
        }
    });
}
