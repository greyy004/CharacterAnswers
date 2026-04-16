import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

const AI_MODEL = 'gemini-2.5-flash';

function normalizeModelContent(content) {
  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item?.text === 'string' ? item.text : ''))
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  return '';
}

function getAiClient() {
  if (!process.env.GEMINI_KEY) {
    throw new Error('Missing GEMINI_KEY in the server environment.');
  }

  return new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
}

/**
 * Keeps provider-specific response handling out of controllers so swapping
 * models or vendors later only affects the service layer.
 */
export async function generateAiReply(message) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: message
  });

  return normalizeModelContent(response.text) || 'No response generated.';
}
