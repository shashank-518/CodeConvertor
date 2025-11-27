import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors"
import  dotenv from "dotenv"


dotenv.config()

const app = express();

app.use(express.json());
const GEMINI_KEY = process.env.API_KEY

// Initialise Gemini
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
)
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

// Function to convert code
async function convertCode(sourceCode, fromLang, toLang) {
  const prompt = `
You are a code-conversion AI.

TASK:
- Convert the given code from ${fromLang} to ${toLang}.
- Return ONLY the converted code.
- Do NOT include explanations.
- If the input is NOT valid code, return exactly: "invalid code"

SOURCE CODE:
"""
${sourceCode}
"""
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  // extract only the text (converted code)
  return response.text();
}

// POST API
app.post("/convert", async (req, res) => {
  try {
    const { sourceCode, fromLang, toLang } = req.body;

    if (!sourceCode || !fromLang || !toLang) {
      return res.status(400).json({
        error: "sourceCode, fromLang, and toLang are required"
      });
    }

    const converted = await convertCode(sourceCode, fromLang, toLang);

    res.json({
      status: "success",
      convertedCode: converted
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error converting code",
      details: error.toString()
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
