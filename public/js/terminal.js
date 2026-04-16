const socket = new WebSocket(`ws://${window.location.host}`);

const output = document.getElementById('output');
const input = document.getElementById('input');
const status = document.getElementById('status');
const sendBtn = document.getElementById('sendBtn');

function setStatus(text, state) {
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

  if (socket.readyState !== WebSocket.OPEN) {
    print('[ERROR] Unable to send command. Socket is not open.', 'error');
    return;
  }

  print(`> ${msg}`, 'user');
  socket.send(msg);
  input.value = '';
}

socket.addEventListener('open', () => {
  setStatus('Online', 'online');
  print('[SYSTEM] Connected to server ✔', 'system');
});

socket.addEventListener('message', (event) => {
  try {
    const data = JSON.parse(event.data);
    const sender = data.sender || 'server';
    print(`[${sender.toUpperCase()}] ${data.message}`, 'server');
  } catch (e) {
    print(`[SERVER] ${event.data}`, 'server');
  }
});

socket.addEventListener('close', () => {
  setStatus('Offline', 'offline');
  print('[SYSTEM] Disconnected ❌', 'error');
});

socket.addEventListener('error', () => {
  setStatus('Offline', 'offline');
  print('[SYSTEM] Error occurred ⚠', 'error');
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendCommand();
  }
});

sendBtn.addEventListener('click', sendCommand);
input.focus();
