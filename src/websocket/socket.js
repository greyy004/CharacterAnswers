import { WebSocketServer } from 'ws';
import { handleMessage } from '../controllers/messageController.js';

function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', async (data) => {
      const message = data.toString();

      // send websocket input to controller
      const result = await handleMessage({
        message,
        sender: 'chat-bot'
      });

      // send controller response back to client
      ws.send(JSON.stringify(result));
    });
  });
}

export default initWebSocket;