from flask import Flask, request, jsonify, render_template

import pandas as pd
import numpy as np
import pickle
import os
import google.generativeai as genai
import requests
import base64
from ultralytics import YOLO
from PIL import Image
import cv2

app = Flask(__name__, static_folder='static', template_folder='templates')


API_KEY = '932d815bb62f2a2b5d40c6e175dcd2a1'
BASE_URL = "https://api.openweathermap.org/data/2.5/weather?q="

GOOGLE_API_KEY = "AIzaSyDjBESa-5KGhDi7f-N4aYctTm7Q5Lnr2ug"
genai.configure(api_key=GOOGLE_API_KEY)

genai_model = genai.GenerativeModel("gemini-1.5-flash")





with open("server/LogisticRegresion.pkl", "rb") as file:
    model = pickle.load(file)
@app.route('/')
def home():
    return render_template('home.html')
@app.route('/crop-recommendation', methods=['GET', 'POST'])
def crop_recommendation():
    if request.method == 'GET':
        return render_template('crop_recommendation.html')
    

    nitrogen = float(request.form['nitrogen'])
    phosphorus = float(request.form['phosphorus'])
    potassium = float(request.form['potassium'])
    temperature = float(request.form['temperature'])
    humidity = float(request.form['humidity'])
    ph = float(request.form['ph'])
    rainfall = float(request.form['rainfall'])

    feature_names = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    input_data = pd.DataFrame([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]],
                               columns=feature_names)

 
    prediction = model.predict(input_data)
    

    result = {
        'inputs': {
            'Nitrogen': nitrogen,
            'Phosphorus': phosphorus,
            'Potassium': potassium,
            'Temperature': temperature,
            'Humidity': humidity,
            'pH': ph,
            'Rainfall': rainfall
        },
        'recommended_crop': prediction[0]
    }
    
    return jsonify(result)


def get_weather_data(city_name):
    complete_url = f"{BASE_URL}{city_name}&appid={API_KEY}&units=metric"
    response = requests.get(complete_url)
    
    if response.status_code == 200:
        data = response.json()
        return {
            "city": data["name"],
            "country": data["sys"]["country"],
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "condition": data["weather"][0]["main"],
            "description": data["weather"][0]["description"]
        }
    else:
        return None

@app.route("/weather", methods=["GET", "POST"])
def weather():
    weather_data = None
    if request.method == "POST":
        city = request.form.get("city")
        weather_data = get_weather_data(city)
    return render_template("weather.html", weather=weather_data)


def get_farming_response(user_query):
    """Fetches a response from the Generative AI model based on the farming query."""
    prompt = f"You are an expert in farming. Answer the following question in a simple and practical way:\n\n{user_query}"
    response = genai_model.generate_content(prompt)
   
    return response.text if response else "I'm not sure about that. Can you ask differently?"


@app.route("/chatbot", methods=["GET", "POST"])
def chatbot():
    if request.method == "POST":
        user_input = request.json.get("message", "")
        print(f"User input: {user_input}")
        
        
        response = get_farming_response(user_input)
        
        
        cleaned_response = response.replace('*', '').replace('**', '')
        
        print(f"Cleaned Model response: {cleaned_response}")
        return jsonify({"response": cleaned_response})

    return render_template("chatbot.html") 






UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  


yolo_model = None


def load_yolo_model():
    global yolo_model
    try:
        yolo_model = YOLO('server/best.pt')
        print("YOLO model loaded successfully")
    except Exception as e:
        print(f"Error loading YOLO model: {e}")
    return yolo_model


with app.app_context():
    load_yolo_model()

def inference(image):

    global yolo_model
    if yolo_model is None:
        yolo_model = load_yolo_model()
    
    
    if isinstance(image, str) and image.startswith('data:image'):
      
        encoded_data = image.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    elif not isinstance(image, np.ndarray):
       
        image = np.array(image)
    
    
    results = yolo_model.predict(image, conf=0.4)
    
 
    result_data = []
    annotated_img = None
    
    for r in results:
     
        annotated_img = r.plot()
        
       
        if r.boxes is not None and len(r.boxes) > 0:
            for i in range(len(r.boxes)):
                cls_id = int(r.boxes.cls[i].item())
                conf = float(r.boxes.conf[i].item())
                class_name = r.names[cls_id]
                
               
                result_data.append({
                    'class_id': cls_id,
                    'class_name': class_name, 
                    'confidence': round(conf * 100, 2),
                    'bbox': r.boxes.xyxy[i].tolist() if r.boxes.xyxy is not None else None
                })
    
    
    _, buffer = cv2.imencode('.jpg', annotated_img)
    annotated_img_b64 = base64.b64encode(buffer).decode('utf-8')
    
    return annotated_img_b64, result_data



@app.route('/plant-disease')
def plant_disease():
    return render_template('plant_disease.html')

@app.route('/api/detect', methods=['POST'])
def detect_disease():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    
    img = Image.open(file.stream)
    
   
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    img.save(img_path)
    
    try:
        annotated_img, detections = inference(img)
        
        
        disease_info = []
        for detection in detections:
            disease_name = detection['class_name']
            confidence = detection['confidence']
            
            
            treatment_info = get_treatment_for_disease(disease_name)
            
            disease_info.append({
                'name': disease_name,
                'confidence': confidence,
                'treatment': treatment_info
            })
        
        return jsonify({
            'success': True,
            'image': f'data:image/jpeg;base64,{annotated_img}',
            'detections': disease_info
        })
    
    except Exception as e:
        print(f"Error during inference: {e}")
        return jsonify({'error': str(e)}), 500

def get_treatment_for_disease(disease_name):
    """
    Return treatment recommendations based on the detected disease
    """
    treatments = {
        'bacterial_spot': 'Use copper-based fungicides, ensure good air circulation, and practice crop rotation.',
        'early_blight': 'Remove infected leaves, apply fungicides containing chlorothalonil, and maintain proper plant spacing.',
        'late_blight': 'Apply fungicides preventatively, remove infected plants, avoid overhead irrigation.',
        'leaf_mold': 'Improve air circulation, reduce humidity, and apply appropriate fungicides.',
        'septoria_leaf_spot': 'Remove infected leaves, apply fungicides, and avoid overhead watering.',
        'spider_mites': 'Use insecticidal soap or neem oil, increase humidity, and introduce predatory mites.',
        'target_spot': 'Apply fungicides, remove infected plant parts, and maintain proper spacing.',
        'yellow_leaf_curl_virus': 'Control whiteflies (virus vectors), use resistant varieties, and remove infected plants.',
        'mosaic_virus': 'Remove and destroy infected plants, control aphids, and disinfect gardening tools.',
        'powdery_mildew': 'Apply sulfur-based fungicides, ensure good air circulation, and avoid overhead watering.',
        'healthy': 'Continue regular maintenance and monitoring.'
    }
    
    
    disease_key = disease_name.lower().replace(' ', '_')
    
    return treatments.get(disease_key, 'Consult with a local agricultural extension for specific treatment recommendations.')


if __name__ == '__main__':
    app.run(debug=True)
