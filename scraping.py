import requests #to get the http request
import json #to handle with json type file
from pprint import pprint #to print pretty
import threading #to repeatedly get the data from the web
import time #to change the timestamp to normal time
from model import session,Station,Bike,Weather


def scraping_bikes(api_key,city):
    """Function to scrape Dublin Bikes using API
     and insert returned data to the database in json format"""
    # try:
    uri = "https://api.jcdecaux.com/vls/v1/stations"
    # Formatting request structure
    r = requests.get(uri, params={'contract': 'DUBLIN','apiKey':api_key_bikes})
    stations_to_db(r.text)  # api to database

    # except:
    #     #if htere is any problem, print hte traceback
    #     print(traceback.format_exc())



# def scraping_weather(api_key, city):
#     """Function to scrape Dublin Bikes using API
#      and insert returned data to the database in json format"""
#     # try:
#     uri = ""
#     # Formatting request structure
#     r = requests.get(uri, params={'contract': 'DUBLIN', 'apiKey': api_key_weather})
#     weather_to_db(r.text)  # api to database
#
#     # except:
#     #     #if htere is any problem, print hte traceback
#     #     print(traceback.format_exc())
#
#     return

def stations_to_db(data):
    stations=json.loads(data)
    print(type(stations),len(stations))
    for station in stations:
        timestamp=station.get('last_update')
        time_standard=timestamp_convert(timestamp)
        print(station)
        kwargs={'station_id': int(station.get('number')),
              'bike_stands': int(station.get('bike_stands')),
              'available_bike_stands':int(station.get('available_bike_stands')),
              'available_bikes':int(station.get('available_bikes')),
              'status':station.get('status'),
              'last_update':time_standard
                }

        row_bike = Bike(**kwargs)
        session.add(row_bike)
    session.commit()
    return

 # def weather_to_db(data):
 #    weathers=json.loads(data)
 #    print(type(weathers),len(weathers))
 #    for weather in weather:
 #        print(weather)
 #        vals=(weather.get('coord_lon'),
 #              weather.get('coord_lat'),
 #              weather.get('weather_id'),
 #              weather.get('weather_main'),
 #              weather.get('weather_description'),
 #              weather.get('base'),
 #              weather.get('main_temp'),
 #              weather.get('main_feels_like'),
 #              weather.get('main_temp_min'),
 #              weather.get('main_temp_max'),
 #              weather.get('main_pressure'),
 #              weather.get('main_humidity'),
 #              weather.get('visibility'),
 #              weather.get('wind_speed'),
 #              weather.get('wind_deg'),
 #              weather.get('clouds_all'),
 #              weather.get('dt'),
 #              weather.get('sys_type'),
 #              weather.get('sys_id'),
 #              weather.get('sys_message'),
 #              weather.get('sys_country'),
 #              weather.get('sys_sunrise'),
 #              weather.get('sys_sunset'),
 #              weather.get('timezone'),
 #              weather.get('city_id'),
 #              weather.get('name'),
 #              weather.get('cod'),
 #             )
 #        engine.execute("insert into station values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",vals)
 #    return

# this class is used for loop calling the function,rewrite the run method

def timestamp_convert(timestamp):
    if len(str(timestamp))==13:
        timeStamp=str(timestamp)[:-3]
        localTime = time.localtime(int(timeStamp))
        strTime = time.strftime("%Y-%m-%d %H:%M:%S", localTime)
        return strTime

class RepeatingTimer(threading.Timer):
    def run(self):
        while not self.finished.is_set():
            self.function(*self.args, **self.kwargs)
            self.finished.wait(self.interval)

api_key_bikes="0bef7f2fab41ef8a396b1e3ab0c929ac8138e3e1"
city="DUBLIN"
api_key_weather=""
# setting the scraper on a timer - every five second
bike = RepeatingTimer(300.0, scraping_bikes, args=[api_key_bikes,city])
weather = RepeatingTimer(300.0, api_key_weather, args=[api_key_bikes,city])
bike.start()
# weather.start()