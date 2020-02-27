from flask import Flask, render_template, jsonify
from model import Session, Station

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
    return jsonify(stations=stations)

if __name__ == '__main__':
    app.run(debug=True)