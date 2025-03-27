from flask import Flask, request, jsonify
from googletrans import Translator
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
translator = Translator()

@app.route('/translate', methods=['POST'])
def translate_text():
    try:
        data = request.json
        print(data)
        text = data.get('q')
        target_language = data.get('target_language', 'vi')  # Default to Vietnamese

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        # Perform the translation
        translated = translator.translate(text, dest=target_language)
        return jsonify({'translatedText': translated.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)