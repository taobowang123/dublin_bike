import requests #to get the http request
import json #to handle with json type file
from pprint import pprint #to print pretty
import threading #to repeatedly get the data from the web
from sqlalchemy import create_engine

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

    return

def stations_to_db(data):
    stations=json.loads(data)
    print(type(stations),len(stations))
    for station in stations:
        print(station)
        vals=(int(station.get('number')),
              station.get('name'),
              station.get('address'),
              station.get('position').get('lat'),
              station.get('position').get('lng'),
              int(station.get('banking')),
              int(station.get('bonus')),
              station.get('contract_name'),
              #station.get('bike_stands'),
              # station.get('status')
             )
        engine.execute("insert into station values(%s,%s,%s,%s,%s,%s,%s,%s)",vals)

    return





# this class is used for loop calling the function,rewrite the run method
class RepeatingTimer(threading.Timer):
    def run(self):
        while not self.finished.is_set():
            self.function(*self.args, **self.kwargs)
            self.finished.wait(self.interval)

engine = create_engine('mysql+pymysql://root:wbt62803683@localhost:3306/dublin_bike')
api_key_bikes="0bef7f2fab41ef8a396b1e3ab0c929ac8138e3e1"
city="DUBLIN"
# setting the scraper on a timer - every five second
t = RepeatingTimer(5.0, scraping_bikes, args=[api_key_bikes,city])
t.start()