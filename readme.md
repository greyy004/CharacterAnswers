# Character Answers

Character Answers is a lightweight Express and Socket.IO chat app with temporary room codes and AI replies.

## Setup

```bash
npm install
npm run dev
```

Create a `.env` file with:

```env
WS_PORT=5000
GEMINI_KEY=your_api_key_here
```

## Structure

- `server.js` starts Express, routes, and Socket.IO
- `src/controllers/roomController.js` handles room creation and room validation
- `src/controllers/messageController.js` formats chat responses from the AI service
- `src/services/aiChatService.js` contains Gemini-specific request logic
- `src/stores/roomStore.js` stores active rooms in memory
- `src/websocket/socket.js` manages join events and chat broadcasts
- `src/utils/chatMessage.js` builds consistent socket/chat payloads
- `public/` contains the browser UI

## Notes

- Rooms are stored in memory only and disappear after a server restart
- The sender sees their own message locally once
- Other users receive the sender message through the websocket broadcast
- AI replies are broadcast to everyone in the room
