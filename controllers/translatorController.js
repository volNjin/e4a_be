import translatorService from "../services/translatorService.js";

const translatorController = {
  async translateText(req, res) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          message: "Text is required for translation.",
        });
      }

      // Call the translation service
      const translatedText = await translatorService.translateText(text);

      return res.status(200).json({
        success: true,
        original: text,
        translated: translatedText,
      });
    } catch (error) {
      console.error("Error translating text:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to translate text.",
      });
    }
  },
};

export default translatorController;