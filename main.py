from flask import Flask, render_template
from model import session
import pandas as pd

app = Flask(__name__)
@app.route('/')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)