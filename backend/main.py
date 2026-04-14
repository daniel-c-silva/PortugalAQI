import time 
from flask.cli import load_dotenv
import requests
from mistralai.client import Mistral
from flask import Flask, jsonify
from flask_cors import CORS 
import os 
from flask_caching import Cache # ?so i dont keep asking mistral for the same city every 1 second.

load_dotenv() # * load env variables. api keys


app = Flask(__name__) # * the app using it to create routes and stuff
CORS(app) # * this is used so the frontend can acess the backend.


cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache'}) # * this is used to cache the results of the get_city_description function, so we dont keep asking mistral for the same city every 1 second.


# ! Setup Mistral
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")  # .envd

client = Mistral(api_key=MISTRAL_API_KEY)


# ! Setup AQI
AQ_API_KEY = os.getenv("AQ_API_KEY")  # .envd

stations = [ 
    # ? Viana do castelo sem info desde jan 2026
   #! Braga distr
   "A164116", # * Braga, Braga
   "A539401", # * Guimaraes, Braga
   # ?  no bragança data
   # ! Vila Real distr
    "A539404", # * Borbela e lamas douro, Vila Real
   # ! Porto distr
   "A539383", # * Francisco sa carneiro, Porto
   #! AVEIRO distr
   "A572635", # * Santiais, Aveiro
   "A540427", # * Espinho, Aveiro
   #! Viseu distr
   "A104230", # * Calçada do Terço, "Viseu"
   #! Coimbra distr
   "A539422", # * Coimbra
   # ! Leiria distr
   "A539434",# * Ervedeira, Leiria 
   # ! Lisbon distr
   "A97159", # * R, Filipe da mata, Lisboa
   # ! setubal distr
   "A539446", # * Seixal
   # ! Faro distr
   "portugal/faro/Joaquim-Magalhaes" # * Faro
]


# ! HELPER FUNCTIONS.


# ! helper function to get air quality index per city and last time it was updated
def get_air_quality_by_zone():
    for station in stations: # * for each station in stations

        url = f"https://api.waqi.info/feed/{station}/?token={AQ_API_KEY}" # * define url as the station url and use the api key to access it

        response = requests.get(url) # * get the urls info using requests and name it response
        data = response.json() # * convert to json name it data
            
        aqi = data["data"]["aqi"] # * aqi or air qlty indx, extract from our data-[aqi] (in this api every thing is inside data so we do data[data])
        full_name = data["data"]["city"]["name"] # * city, extract from data-[city]
        Time = data["data"]["time"]["s"] # * extract time 




        # ! conditions to fix city names before returning them to the ai.
        # * fix some city names.
        if "Faro" in full_name:
            city = "Faro"
        elif "Filipe" in full_name:
            city = "Lisbon"
        elif "Calçada do Terço" in full_name:
            city = "Viseu"
        else:
            city = full_name.split(",")[-1] # * extract city name not station name.

        yield city, aqi , Time # * return city, aqi and time ;(yield is basically return but allows to keep the function running.)


# ! helperfunction to get a comment about the city and it's AQI 
def get_city_description(city, aqi, Time):
    
    prompt = f"Write exactly one line using this template: (exceptions: IF CITY is R Filipe Da Mata then name it Lisbon and its aqi and time are now tied to lisbon. the aqi evaluation city description and industry MUST BE about lisbon when we talk about r Filipe Da Mata IF WE ARE NOT TALKING ABOUT R FILIPE DA MATA WE DO NOT MENTION IT OR LISBON EVER.){city}, {aqi}, {Time}; [Air Quality Evaluation], [City Description], Industry type: [Industry]. Do not use bolding, do not use bullet points, and do not press enter."
    response = client.chat.complete(model="mistral-large-latest", messages=[{"role": "user", "content": prompt}])

    return response.choices[0].message.content 





# ! MAIN ROUTE

# ! main function.
@app.route("/") 
@cache.cached(timeout=300) # * cache the results of this function for 5 minutes, so we dont keep asking mistral for the same city every 1 second.
def home():
    output = [] # * create an empty list to store the output
    for city, aqi, Time in get_air_quality_by_zone(): 
        description = get_city_description(city, aqi, Time) # * description is the return of get city description function.
        output.append({ # * add to the output list a dictionary with the following keys and values.
            "city": city.strip(), 
            "aqi": aqi, 
            "time": Time,
            "description": description
        })
        time.sleep(1) # * sleep for 1 sec before the next request.
    return jsonify(output) 




if __name__ == "__main__": 
   app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5002)), debug=True) #! this is used to run the app. host