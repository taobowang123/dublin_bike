from flask import Flask, render_template, jsonify
from model import Session, Station, Bike
import pandas as pd
import json
import pymysql

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
    session.close()
    return jsonify(available_info=available_info)

@app.route('/station_occupancy_weekly/<int:station_id>')
def get_occupancy_weekly(station_id):
    conn = pymysql.connect(host='dbbikes.cw9hkqmrhrqy.eu-west-1.rds.amazonaws.com', user='root', password='hanpeisong',
                          db='dbbikes', use_unicode=True, charset='utf8')
    days = ['Mon','Tue','Wed','Thurs','Fri','Sat','Sun']
    df = pd.read_sql_query("select * from bike \
                           where station_id = {};".format(station_id),conn)
    df['last_update_date']=pd.to_datetime(df.last_update, unit='ms')
    df.set_index('last_update_date',inplace=True)
    df['weekday']=df.index.weekday
    mean_available_stands=df[['available_bike_stands','weekday']].groupby('weekday').mean()
    mean_available_bikes=df[['available_bikes','weekday']].groupby('weekday').mean()
    mean_available_stands.index=days
    mean_available_bikes.index=days
    print(mean_available_bikes)
    return (mean_available_stands.to_json())

@app.route('/station_occupancy_hourly/<int:station_id>')
def get_occupancy_hourly(station_id):
    conn = pymysql.connect(host='dbbikes.cw9hkqmrhrqy.eu-west-1.rds.amazonaws.com', user='root', password='hanpeisong',
                          db='dbbikes', use_unicode=True, charset='utf8')
    hours = [x for x in range(23)]
    df = pd.read_sql_query("select * from bike \
                           where station_id = {};".format(station_id),conn)
    df['last_update_date']=pd.to_datetime(df.last_update, unit='ms')
    df.set_index('last_update_date',inplace=True)
    df['hours']=df.index.hour
    mean_available_stands=df[['available_bike_stands','hours']].groupby('hours').mean()
    mean_available_bikes=df[['available_bikes','hours']].groupby('hours').mean()
    mean_available_stands.index=hours
    mean_available_bikes.index=hours
    print(mean_available_bikes)
    return (mean_available_stands.to_json())

if __name__ == '__main__':
    app.run(debug=True)