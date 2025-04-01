from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator
from nltk.corpus import wordnet
import nltk

# Ensure required NLTK data is downloaded
nltk.download("wordnet")
nltk.download("omw-1.4")

app = Flask(__name__)
CORS(app)


def get_word_info(text, target_lang="vi"):
    words = text.split()  # Split the text into words
    if len(words) > 1:
        # If it's a sentence, just translate it
        try:
            translator = GoogleTranslator(source="en", target=target_lang)
            translated_text = translator.translate(text)
        except Exception as e:
            translated_text = f"Error during translation: {str(e)}"
        print(translated_text)
        return translated_text

    # If it's a single word, fetch WordNet details
    word = words[0]
    synsets = wordnet.synsets(word)

    if not synsets:
        return {"error": f"No information found for the word '{word}' in WordNet."}

    word_info = {}
    for syn in synsets:
        pos = syn.pos()  # Part of speech (noun, verb, adjective, etc.)
        synonyms = list(
            {lemma.name().replace("_", " ") for lemma in syn.lemmas()}
        )  # Synonyms
        antonyms = list(
            {
                ant.name().replace("_", " ")
                for lemma in syn.lemmas()
                for ant in lemma.antonyms()
            }
        )  # Antonyms
        definition = syn.definition()  # Definition
        examples = syn.examples()  # Usage examples

        if pos not in word_info:
            word_info[pos] = {
                "synonyms": synonyms,
                "antonyms": antonyms,
                "definition": definition,
                "examples": examples,
            }

    pos_order = ["n", "v", "a", "r"]  # Exclude 's'
    filtered_word_info = {k: v for k, v in word_info.items() if k in pos_order}
    sorted_word_info = {
        k: filtered_word_info[k]
        for k in sorted(filtered_word_info, key=lambda x: pos_order.index(x))
    }
    # Translate the single word
    try:
        translator = GoogleTranslator(source="en", target=target_lang)
        translated_word = translator.translate(word)
    except Exception as e:
        translated_word = f"Error during translation: {str(e)}"
    return {
        "translated": translated_word,
        "details": sorted_word_info,
    }


@app.route("/translate", methods=["POST"])
def word_info():
    try:
        # Ensure the request is JSON
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        data = request.json
        text = data.get("text")
        target_language = data.get("target_language", "vi")  # Default to Vietnamese

        if not text:
            return jsonify({"error": "Text is required"}), 400

        info = get_word_info(text, target_language)
        return jsonify(info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000)
