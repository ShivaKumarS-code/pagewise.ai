import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables.');
}

// Pass the API key directly as a string, not as an object
export const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);

export const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });