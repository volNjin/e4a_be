import axios from "axios";

const translatorService = {
  async translateText(text) {
    try {
      // Call LibreTranslate API
      const response = await axios.post("http://localhost:5000/translate", {
        q: text, // Text to translate
        source: "en", // Source language (English)
        target: "vi", // Target language (default: Vietnamese)
        format: "text", // Format of the text
      });

      // Extract the translated text from the API response
      return response.data.translatedText;
    } catch (error) {
      console.error("Error in translation service:", error.response?.data || error.message);
      throw new Error("Translation service failed.");
    }
  },
};

export default translatorService;