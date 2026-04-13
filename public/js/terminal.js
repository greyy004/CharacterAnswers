const socket = new WebSocket(`ws://${window.location.host}`);

const output = document.getElementById('output');
const input = document.getElementById('input');

// Print line to terminal
function print(text) {
  const div = document.createElement('div');
  div.className = 'line';
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

// Connection opened
socket.addEventListener('open', () => {
  print("[SYSTEM] Connected to server ✔");
});

// Receive message
socket.addEventListener('message', (event) => {
  try {
    const data = JSON.parse(event.data);
    print(`[SERVER] ${data.message} (from ${data.sender})`);
  } catch (e) {
    print("[SERVER] " + event.data);
  }
});

// Connection closed
socket.addEventListener('close', () => {
  print("[SYSTEM] Disconnected ❌");
});

// Error
socket.addEventListener('error', () => {
  print("[SYSTEM] Error occurred ⚠");
});

// Send message on Enter
input.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    const msg = input.value.trim();
    if (!msg) return;

    print("C:\\user> " + msg);
    
    try {
      socket.send(msg);
    } catch (error) {
      print("[ERROR] " + error.message);
    }

    input.value = "";
  }
});