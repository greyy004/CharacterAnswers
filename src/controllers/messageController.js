import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

export const handleMessage = async ({ message, sender }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message
    });
    
    return {
      sender,
      message: response.text,
      time: new Date().toISOString()
    };
  } catch (error) {
    console.error("DEBUG ERROR:", error);
    return {
      type: "error",
      message: "AI is busy. Try again in a moment."
    };
  }
};
