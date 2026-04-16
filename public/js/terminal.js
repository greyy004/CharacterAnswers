const socket = io();

const output = document.getElementById('output');
const input = document.getElementById('input');
const sendButton = document.getElementById('sendBtn');
const roomCode = window.location.pathname.split('/').filter(Boolean).at(-1)?.toUpperCase() || '';

function printLine(text, type = 'server') {
  const line = document.createElement('div');
  line.className = `line line--${type}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function renderIncomingMessage(payload) {
  if (typeof payload === 'string') {
    printLine(payload, 'server');
    return;
  }

  const { type = 'message', sender = 'server', message = '' } = payload || {};
  if (!message) return;

  if (type === 'system') {
    printLine(message, 'system');
    return;
  }

  if (type === 'error') {
    printLine(message, 'error');
    return;
  }

  if (sender === 'chat-bot') {
    printLine(`chat-bot: ${message}`, 'server');
    return;
  }

  printLine(`${sender}: ${message}`, 'user-peer');
}

function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  if (!socket.connected) {
    printLine('Unable to send message. Socket is not connected.', 'error');
    return;
  }

  printLine(`you: ${message}`, 'user');
  socket.emit('chat:message', message);
  input.value = '';
}

socket.on('connect', () => {
  printLine('Connected to server', 'system');
  socket.emit('room:join', { roomCode });
});

socket.on('room:joined', () => {});

socket.on('chat:message', (payload) => {
  renderIncomingMessage(payload);
});

socket.on('room:error', (payload) => {
  printLine(payload?.message || 'Room error', 'error');
});

socket.on('disconnect', () => {
  printLine('Disconnected', 'error');
});

socket.on('connect_error', () => {
  printLine('Unable to connect to the server.', 'error');
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

sendButton.addEventListener('click', sendMessage);
input.focus();
