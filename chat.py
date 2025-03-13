from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__,template_folder="templates")

# Set your API key directly here
api_key = 'AIzaSyDDjl8ZZjjhD49BmSbtWk-iOB5IAnS6LaM'  # Replace with your actual API key

# Configure the Gemini API
genai.configure(api_key=api_key)

# Load the Gemini Pro model
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

def get_farming_response(question):
    """
    Sends a farming-related question to the Gemini model and returns the response.
    """
    prompt = f"You are a knowledgeable farmer bot. Answer the following farming-related question: {question}"
    try:
        response = chat.send_message(prompt, stream=True)
        return " ".join(chunk.text for chunk in response)
    except Exception as e:
        return f"Error occurred while getting response: {e}"

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.json.get('question')
    if user_input:
        response = get_farming_response(user_input)
        return jsonify({'response': response})
    return jsonify({'response': "No question provided."}), 400

if __name__ == "__main__":
     app.run(debug=True ,port=5050,use_reloader=False)