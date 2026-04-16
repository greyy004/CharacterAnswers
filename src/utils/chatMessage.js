export function createChatMessage({ sender, message, type = 'message' }) {
  return {
    type,
    sender,
    message,
    time: new Date().toISOString()
  };
}
