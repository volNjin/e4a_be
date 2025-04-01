import axios from "axios";

const translatorService = {
  async translateText(text) {
    try {
      // Call LibreTranslate API
      const response = await axios.post("http://127.0.0.1:5000/translate", {
        text, // Text to translate or analyze
        target_language: 'vi',
      });

      // Extract the translated text from the API response
      return response.data;
    } catch (error) {
      console.error("Error in translation service:", error.response?.data || error.message);
      throw new Error("Translation service failed.");
    }
  },
};

export default translatorService;