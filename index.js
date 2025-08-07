import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analyze', async (req, res) => {
  const { transactions, goals } = req.body;

  const prompt = `
    Based on this user's transactions and goals, provide 3 friendly financial insights.

    Transactions:
    ${JSON.stringify(transactions, null, 2)}

    Goals:
    ${JSON.stringify(goals, null, 2)}

    Use helpful, encouraging tone. Be specific.
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

app.listen(port, () => {
  console.log(`Gemini server running on http://localhost:${port}`);
});
