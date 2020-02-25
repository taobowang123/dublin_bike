from model import session, Base, Station, engine
import json

# Drop all the tables
Base.metadata.drop_all(engine, checkfirst=True)
print("Deleted Tables")
# Create the table based on class
Base.metadata.create_all(engine)
print("Created Tables")

# Init the station data.
contract_name = 'Dublin'
data = json.load(open('static/dublin_bike_static.json'))

for station in data:
    kwargs = {'id': station['number'],
              'name': station['name'],
              'address': station['address'],
              'position_lat': station['position']['lat'],
              'position_lng': station['position']['lng'],
              'banking': station['banking'],
              'bonus': station['bonus'],
              'contract_name': 'Dublin'}
    row_station = Station(**kwargs)
    session.add(row_station)

session.commit()