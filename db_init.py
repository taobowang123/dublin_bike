from sqlalchemy import Column, Integer, String, Float, Boolean, create_engine, MetaData
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

# Init the database connection.
# For the local databsae test.
#engine = create_engine('mysql+pymysql://root:hanpeisong@localhost:3306/dbbikes')
# For the RDS
engine = create_engine('mysql+pymysql://hanpeisong:hanpeisong@dbbikes.cigtojcdjbjk.eu-west-1.rds.amazonaws.com:3306/dbbikes')

# Drop all the tables
Base.metadata.drop_all(engine, checkfirst=True)

# Create the table based on class
Base.metadata.create_all(engine)

# Create the type of DBSession.
DBSession = sessionmaker(bind=engine)

# Create the session object.
session = DBSession()

# TODO: Add the new tuples into station table.
#kwargs = {'id': 0,
#          'contract_name': 'test',
#          'name': 'test',
#          'address': 'test',
#          'position_lat': 0.0,
#          'position_lng': 0.0,
#          'banking': False,
#          'bonus': False}
#station = Station(**kwargs)
#session.add(station)
#session.commit()
