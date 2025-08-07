const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// IMPORTANT: Set your GEMINI_API_KEY in the Firebase project's environment variables
// firebase functions:config:set gemini.api_key="YOUR_API_KEY"

const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);

exports.analyze = functions.https.onRequest(async (req, res) => {
    // You must set CORS headers for a Cloud Function to be called from your web app
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.status(204).send('');
      return;
    }

    const { transactions, goals } = req.body;

    const prompt = `
      Based on this user's transactions and goals, provide 3 friendly financial insights.

      Transactions:
      ${JSON.stringify(transactions, null, 2)}

      Goals:
      ${JSON.stringify(goals, null, 2)}

      Use a helpful, encouraging tone. Be specific.
    `;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      res.json({ insights: response });
    } catch (error) {
      console.error("Gemini error:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
});