from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

OLLAMA_API_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "phi"


chat_history = [{
    "role": "system",
    "content": "Your are a helpful assistant. Answer the question:"
}]


@app.route('/api/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        input_text = data.get("text", "")

        # Add user's message to history
        chat_history.append({"role": "user", "content": input_text})

        # Send to Ollama
        response = requests.post(OLLAMA_API_URL, json={
            "model": OLLAMA_MODEL,
            "messages": chat_history,
            "stream": False
        })

        res_json = response.json()
        ai_reply = res_json.get("message", {}).get("content", "")

        # Add AI response to history
        chat_history.append({"role": "assistant", "content": ai_reply})

        return jsonify({"response": ai_reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
     app.run(host="127.0.0.1", port=5000, debug=True)
