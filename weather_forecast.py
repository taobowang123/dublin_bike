import datetime
import requests
import scraping
import time

weather_data = None

# Function for updating weather automatically
def update_weather_forecast():
    while True:
        url = "http://api.openweathermap.org/data/2.5/forecast"
        global weather_data
        res = requests.get(url, params={'q': 'DUBLIN,IE', 'appid': scraping.api_key_weather})
        weather_data = res.json()
        # Set the interval
        time.sleep(60 * 60 * 1)

# Function for get weather by a specific date and time
def get_weather_forecast(year, month, day, hour):
    dtime = datetime.datetime(year, month, day, hour)
    unixtime = time.mktime(dtime.timetuple())
    for i in range(len(weather_data['list'])):
        if unixtime <= weather_data['list'][i]['dt']:
            if weather_data['list'][i]['weather'][0]['main'] == 'Rain':
                return 1
            else:
                return 0
    return 0
