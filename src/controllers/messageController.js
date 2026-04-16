import { createChatMessage } from '../utils/chatMessage.js';
import { generateAiReply } from '../services/aiChatService.js';

export async function handleMessage({ message, sender }) {
  try {
    const reply = await generateAiReply(message);

    return createChatMessage({
      sender,
      message: reply
    });
  } catch (error) {
    console.error('AI request failed:', {
      status: error?.status,
      code: error?.code,
      name: error?.name,
      message: error?.message
    });

    return createChatMessage({
      sender,
      type: 'error',
      message: error?.message ? `AI request failed: ${error.message}` : 'AI request failed. Please try again.'
    });
  }
}
