import requests  # to get the http request
import json  # to handle with json type file
from pprint import pprint  # to print pretty
import threading  # to repeatedly get the data from the web
import time  # to change the timestamp to normal time
from model import Session, Station, Bike, Weather

# this function is to scrape bikes
def scraping_bikes(api_key):
    """Function to scrape Dublin Bikes using API
     and insert returned data to the database in json format"""
    uri = "https://api.jcdecaux.com/vls/v1/stations"
    # Formatting request structure
    r = requests.get(uri, params={'contract': 'DUBLIN', 'apiKey': api_key_bikes})
    stations_to_db(r.text)  # api to database

# this function is to scrape weather
def scraping_weather(api_key):
    """Function to scrape Dublin Bikes using API
     and insert returned data to the database in json format"""
    uri = "http://api.openweathermap.org/data/2.5/weather"
    # Formatting request structure
    r = requests.get(uri, params={'q': 'DUBLIN,IE', 'appid': api_key_weather})
    weather_to_db(r.text)  # api to database
    return

# this function is to write data into database
def stations_to_db(data):
    session = Session()
    stations = json.loads(data)
    for station in stations:
        timestamp = station.get('last_update')
        time_standard = timestamp_convert(timestamp)
        kwargs = {'station_id': int(station.get('number')),
                  'bike_stands': int(station.get('bike_stands')),
                  'available_bike_stands': int(station.get('available_bike_stands')),
                  'available_bikes': int(station.get('available_bikes')),
                  'status': station.get('status'),
                  'last_update': time_standard
                  }
        row_bike = Bike(**kwargs)
        session.add(row_bike)
    session.commit()
    session.close()
    return

# this function is to write data into database
def weather_to_db(data):
    session = Session()
    weather = json.loads(data)
    timestamp_dt = weather.get('dt')
    time_standard_dt = timestamp_convert(timestamp_dt)
    timestamp_sunrise = weather.get('sys').get('sunrise')
    time_standard_surise = timestamp_convert(timestamp_sunrise)
    timestamp_sunset = weather.get('sys').get('sunset')
    time_standard_sunset = timestamp_convert(timestamp_sunset)
    kwargs ={
        'coord_lon':weather.get('coord').get('lon'),
        'coord_lat':weather.get('coord').get('lat'),
        'weather_id':weather.get('weather')[0]['id'],
        'weather_main':weather.get('weather')[0]['main'],
        'weather_description': weather.get('weather')[0]['description'],
        'weather_icon':weather.get('weather')[0]['icon'],
        'base':weather.get('base'),
        'main_temp': weather.get('main').get('temp'),
        'main_feels_like':weather.get('main').get('feels_like'),
        'main_temp_max':weather.get('main').get('temp_max'),
        'main_temp_min': weather.get('main').get('temp_min'),
        'main_pressure':weather.get('main').get('pressure'),
        'main_humidity': weather.get('main').get('humidity'),
        'visibility': weather.get('visibility'),
        'wind_speed': weather.get('wind').get('speed'),
        'wind_deg': weather.get('wind').get('speed'),
        'clouds_all': weather.get('clouds').get('all'),
        'dt':time_standard_dt,
        'sys_type':weather.get('sys').get('type'),
        'sys_id': weather.get('sys').get('id'),
        'sys_country': weather.get('sys').get('country'),
        'sys_sunrise':time_standard_surise,
        'sys_sunset':time_standard_sunset,
        'timezone':weather.get('timezone'),
        'city_id':weather.get('id'),
        'name': weather.get('name'),
        'cod':weather.get('cod'),
    }
    row_weather = Weather(**kwargs)
    session.add(row_weather)
    session.commit()
    session.close()
    return

# this class is used for loop calling the function,rewrite the run method
def timestamp_convert(timestamp):
    if len(str(timestamp)) == 13:
        timeStamp = str(timestamp)[:-3]
        localTime = time.localtime(int(timeStamp))
        strTime = time.strftime("%Y-%m-%d %H:%M:%S", localTime)
    if len(str(timestamp))==10:
        localTime = time.localtime(int(timestamp))
        strTime = time.strftime("%Y-%m-%d %H:%M:%S", localTime)
    return strTime

class RepeatingTimer(threading.Timer):
    def run(self):
        while not self.finished.is_set():
            self.function(*self.args, **self.kwargs)
            self.finished.wait(self.interval)


api_key_bikes = "0bef7f2fab41ef8a396b1e3ab0c929ac8138e3e1"
api_key_weather = "cef2a44a33227fe85d0eb0430c4b0d40"
# setting the scraper on a timer - every five second
bike = RepeatingTimer(300.0, scraping_bikes, args=[api_key_bikes])
weather = RepeatingTimer(300.0, scraping_weather, args=[api_key_weather])
bike.start()
weather.start()
