from sqlalchemy import Column, Integer, String, Float, Boolean, create_engine, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Create the base class.
Base = declarative_base()

# Define the Station class
class Station(Base):
    # The name of table.
    __tablename__ = "station"
    # The structure of the table.
    id = Column(Integer, primary_key=True, autoincrement=False)
    name = Column(String(50), nullable=False)
    address = Column(String(50), nullable=False)
    position_lat = Column(Float, nullable=False)
    position_lng = Column(Float, nullable=False)
    banking = Column(Boolean, nullable=True)
    bonus = Column(Boolean, nullable=True)
    contract_name = Column(String(100), nullable=False)

class Bike(Base):
    # The name of table.
    __tablename__ = "bike"
    # The structure of the table.
    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(Integer, ForeignKey('station.id'))
    status = Column(String(50), nullable=False)
    bike_stands = Column(Integer, nullable=False)
    available_bike_stands = Column(Integer, nullable=False)
    available_bikes = Column(Integer, nullable=False)
    last_update = Column(DateTime, nullable=False)

class Weather(Base):
    # The name of table.
    __tablename__ = "weather"
    id = Column(Integer, primary_key=True, autoincrement=True)
    # The structure of the table.
    coord_lon = Column(Float)
    coord_lat = Column(Float)
    weather_id = Column(Integer)
    weather_main = Column(String(45))
    weather_description = Column(String(45))
    weather_icon = Column(String(10))
    base = Column(String(45))
    main_temp = Column(Float)
    main_feels_like = Column(Float)
    main_temp_min = Column(Float)
    main_temp_max = Column(Float)
    main_pressure = Column(Integer)
    main_humidity = Column(Integer)
    visibility = Column(Integer)
    wind_speed = Column(Float)
    wind_deg = Column(Integer)
    clouds_all = Column(Integer)
    dt = Column(DateTime)
    sys_type = Column(Integer)
    sys_id = Column(Integer)
    sys_message = Column(Float)
    sys_country = Column(String(10))
    sys_sunrise = Column(DateTime)
    sys_sunset = Column(DateTime)
    timezone = Column(Integer)
    city_id = Column(Integer)
    name = Column(String(45))
    cod = Column(Integer)

# Init the database connection.
# For the local database test.
# engine = create_engine('mysql+pymysql://root:hanpeisong@localhost:3306/dbbikes')
# For the RDS
engine = create_engine('mysql+pymysql://root:hanpeisong@dbbikes.cw9hkqmrhrqy.eu-west-1.rds.amazonaws.com:3306/dbbikes')

# Create the type of DBSession.
DBSession = sessionmaker(bind=engine)

# Create the session object.
session = DBSession()

