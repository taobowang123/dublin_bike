from flask import Flask, render_template, jsonify
from model import Session, Station, Bike

app = Flask(__name__)
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/stations')
def get_station():
    session = Session()
    stations = []
    rows = session.execute("select * from station;")
    for row in rows:
        stations.append(dict(row))
    session.close()
    return jsonify(stations=stations)

@app.route('/available/<int:station_id>')
def get_station_available_info(station_id):
    session = Session()
    available_info = []
    rows = session.execute("select available_bike_stands, available_bikes from bike \
        where station_id = {} and last_update = \
        (select max(last_update) from bike where station_id = {});".format(station_id, station_id))
    for row in rows:
        print(row)
        available_info.append(dict(row))
    session.close
    return jsonify(available_info=available_info)

if __name__ == '__main__':
    app.run(debug=True)