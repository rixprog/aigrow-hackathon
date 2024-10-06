from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
import os
from httpx import Client

  # Load environment variables
API_KEY = '922203c872e694fd8e045851ec5e3dd8' # Get the API key from environment variable

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load the crop recommendation model and label encoder
model_filename = 'crop_recommendation_model.pkl'
rf_model = joblib.load(model_filename)

le_filename = 'label_encoder.pkl'
le = joblib.load(le_filename)

@app.route('/predict', methods=['POST'])
def predict_crop():
    try:
        data = request.json

        # Extract input features with validation
        nitrogen = float(data.get('nitrogen', 0))
        phosphorous = float(data.get('phosphorous', 0))
        pottasium = float(data.get('pottasium', 0))
        temperature = float(data.get('temperature', 0))
        humidity = float(data.get('humidity', 0))
        ph = float(data.get('ph', 0))
        rainfall = float(data.get('rainfall', 0))

        # Validate input ranges
        if nitrogen < 0 or phosphorous < 0 or pottasium < 0:
            return jsonify({"error": "Nitrogen, phosphorous, and pottasium must be non-negative."}), 400
        if temperature < -50 or temperature > 60:
            return jsonify({"error": "Temperature must be between -50 and 60 degrees Celsius."}), 400
        if humidity < 0 or humidity > 100:
            return jsonify({"error": "Humidity must be between 0 and 100%."}), 400
        if ph < 0 or ph > 14:
            return jsonify({"error": "pH value must be between 0 and 14."}), 400
        if rainfall < 0:
            return jsonify({"error": "Rainfall must be non-negative."}), 400

        # Prepare the input for prediction
        input_features = np.array([[nitrogen, phosphorous, pottasium, temperature, humidity, ph, rainfall]])

        # Make prediction
        prediction = rf_model.predict(input_features)[0]
        prediction_proba = rf_model.predict_proba(input_features).max()  # Maximum probability

        # Decode the prediction using label encoder
        predicted_crop = le.inverse_transform([prediction])[0]

        # Prepare the response
        response = {
            "crop": predicted_crop,
            "probability": prediction_proba  # Probability between 0 and 1
        }

        return jsonify(response), 200

    except ValueError as ve:
        print(f"Value error: {ve}")
        return jsonify({"error": "Invalid input values."}), 400
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": "An error occurred during prediction."}), 500


@app.route('/get_data', methods=['POST'])
def get_data():
    try:
        data = request.json
        place = data.get('place')

        # Get weather and soil data
        latitude, longitude = get_coordinates(place, API_KEY)
        if latitude is None or longitude is None:
            return jsonify({"error": "Unable to fetch coordinates."}), 400

        weather_data = get_weather(latitude, longitude, API_KEY)
        soil_data = get_soil_data(latitude, longitude)

        if weather_data is None or soil_data is None:
            return jsonify({"error": "Unable to fetch weather or soil data."}), 400

        # Extract and convert temperature from Kelvin to Celsius
        temperature_kelvin = weather_data['main']['temp']
        temperature_celsius = temperature_kelvin - 273.15  # Convert to Celsius
        
        # Add converted temperature to the response
        weather_data['main']['temp_celsius'] = temperature_celsius

        response = {
            "weather": weather_data,
            "soil": soil_data,
        }
        return jsonify(response), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred."}), 500



def get_coordinates(place, api_key):
    geocoding_url = f'http://api.openweathermap.org/data/2.5/weather?q={place}&appid={api_key}'
    response = requests.get(geocoding_url)
    if response.status_code == 200:
        data = response.json()
        return data['coord']['lat'], data['coord']['lon']
    return None, None


def get_weather(latitude, longitude, api_key):
    weather_url = f'http://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={api_key}'
    response = requests.get(weather_url)
    if response.status_code == 200:
        return response.json()
    return None


def get_soil_data(latitude, longitude):
    with Client() as client:
        soil_type_response = client.get(url="https://api-test.openepi.io/soil/type", params={"lat": latitude, "lon": longitude})
        soil_type = soil_type_response.json().get("properties", {}).get("most_probable_soil_type", "Unknown")

        bdod_response = client.get(url="https://api-test.openepi.io/soil/property", params={"lat": latitude, "lon": longitude, "depths": "0-5cm", "properties": "bdod", "values": "mean"})
        bdod_value = bdod_response.json()["properties"]["layers"][0]["depths"][0]["values"]["mean"]
        
        return {"soil_type": soil_type, "bdod_value": bdod_value}
    



if __name__ == '__main__':
    app.run(debug=True)
