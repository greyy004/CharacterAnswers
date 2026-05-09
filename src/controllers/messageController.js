import { createChatMessage } from '../utils/chatMessage.js';
import { storeMessage } from '../models/messageModel.js';
import { generateAiReply } from '../services/aiChatService.js';

export async function handleMessageForAI({ message, sender }) {
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


export const handleMessage = async (sender, message, roomId) => {
  try {
    const result = await storeMessage(sender, message, roomId);
    return result;
  }
  catch (err) {
    console.log("error in handle message in msg controller: ", err);
  }
}