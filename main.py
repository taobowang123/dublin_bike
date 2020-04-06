import datetime

import pandas as pd
import pymysql
import json
from flask import Flask, render_template, jsonify

import weather_forecast
from model import Session
import threading

thread_weather_forecast = threading.Thread(name='weather_forecast', target=weather_forecast.update_weather_forecast)
thread_weather_forecast.start()

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

import pickle
import pandas as pd

@app.route('/predic/<int:station_id>/<requirement>/<predict_date>/<predict_time>')
def predict_available_bikes(station_id, requirement, predict_date, predict_time):
    with open('./prediction_model/models/' + str(station_id) + '_station_model.pkl', 'rb') as handle:
        model = pickle.load(handle)
    year, month, day = (int(x) for x in predict_date.split('-'))
    dayofweek = int(datetime.date(year, month, day).weekday())
    hour = int(predict_time[0:2])
    rain = weather_forecast.get_weather_forecast(year, month, day, hour)
    x_test = [[dayofweek, hour, rain]]
    prediction = model.predict(x_test)
    result = round(prediction[0])
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)