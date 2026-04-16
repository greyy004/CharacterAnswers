const socket = io();

const output = document.getElementById('output');
const input = document.getElementById('input');
const status = document.getElementById('status');
const sendBtn = document.getElementById('sendBtn');

function setStatus(text, state) {
  if (!status) return;
  status.textContent = text;
  status.className = `status status--${state}`;
}

function print(text, type = 'server') {
  const div = document.createElement('div');
  div.className = `line line--${type}`;
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function sendCommand() {
  const msg = input.value.trim();
  if (!msg) return;

  if (!socket.connected) {
    print('Unable to send command. Socket is not connected.', 'error');
    return;
  }

  print(`$ ${msg}`, 'user');
  socket.emit('chat:message', msg);
  input.value = '';
}

socket.on('connect', () => {
  setStatus('online', 'online');
  print('Connected to server', 'system');
});

socket.on('chat:message', (data) => {
  if (typeof data === 'string') {
    print(data, 'server');
    return;
  }

  const sender = data?.sender || 'server';
  const message = data?.message || '';
  print(`${sender}: ${message}`, sender === 'system' ? 'system' : 'server');
});

socket.on('disconnect', () => {
  setStatus('offline', 'offline');
  print('Disconnected', 'error');
});

socket.on('connect_error', () => {
  setStatus('offline', 'offline');
  print('Error occurred', 'error');
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendCommand();
  }
});

sendBtn.addEventListener('click', sendCommand);
input.focus();
