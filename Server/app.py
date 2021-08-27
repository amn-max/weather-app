from flask import Flask,request,jsonify
from flask_restful import Api
import json
from urllib.request import urlopen
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)

MAIN_URL = "http://api.openweathermap.org/data/2.5/find"

latu = "?lat="
lonu = "&lon="

APP_ID = "&cnt=1&units=metric&appid=604a547d139d6f02cc29fe1943947ef3"

def verifyFeel(temp):
    if temp<4.1:
        return "Very Cold"
    elif temp>4.1 and temp<=8.0:
        return "Cold"
    elif temp >=8.1 and temp<=13.0:
        return "Cool"
    elif temp>=13.1 and temp<=18.0:
        return "Slightly Cool"
    elif temp>=18.1 and temp<=23.0:
        return "Confortable"
    elif temp>=23.1 and temp<=29.0:
        return "Slightly Warm"
    elif temp>=29.1 and temp<=35.0:
        return "Warm"
    elif temp>=35.1 and temp<=41.0:
        return "Hot"
    elif temp>=41.0:
        return "Very Hot"

def retrieve_weather(lat,lon):
    r = urlopen(MAIN_URL+latu+lat+lonu+lon+APP_ID)
    data_json = json.loads(r.read())
    temp = data_json['list'][0]['main']['temp']
    feel = verifyFeel(temp)
    data_json['list'][0]['main']['feels'] = feel
    return data_json

@app.route('/')
def data():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    out = jsonify(retrieve_weather(lat,lon))
    return out

if __name__=="__main__":
    app.debug = True
    app.run()