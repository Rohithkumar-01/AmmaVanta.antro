const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/generate-info', async (req, res) => {
    try {
        const { name, category, complexity } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Item name is required for AI generation" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, message: "GEMINI_API_KEY is not configured in the server environment. Please add it to your .env file." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let languageInstruction = "Use basic, simple general words that anyone can easily understand.";
        if (complexity === 'intermediate') {
            languageInstruction = "Use standard, balanced culinary terms.";
        } else if (complexity === 'advanced') {
            languageInstruction = "Use high-end, sophisticated English and advanced culinary vocabulary to sound very premium.";
        }

        const prompt = `You are a professional culinary AI assistant for an Indian restaurant named AmmaVanta. 
A user wants to add a new food item to their menu. The category is "${category || 'general food'}" and the item name is "${name}".
${languageInstruction}
Please provide the following details about this dish:
1. Preparation time (e.g., "15 - 20 minutes")
2. Ingredients used (e.g., "Basmati rice, fresh paneer, tomatoes...")
3. Preparation method. Explain how it is prepared (e.g., "Slow cooked to perfection..."). Ensure the length is short and concise so it fits on a small card.

Return ONLY a valid JSON string without markdown blocks, format EXACTLY like this:
{
  "prepTime": "...",
  "ingredients": "...",
  "preparation": "..."
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // clean possible markdown backticks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);

        res.json({ success: true, data: parsed });

    } catch (err) {
        console.error("AI Generation Error:", err);
        res.status(500).json({ success: false, message: "Failed to generate AI info", error: err.message });
    }
});

module.exports = router;
