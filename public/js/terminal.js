const $ = (id) => document.getElementById(id);
const output = $("output"),
  input = $("input"),
  sendBtn = $("sendBtn");
const roomCode = window.location.pathname.split("/").pop()?.toUpperCase() || "";
const socket = io({ withCredentials: true });

const print = (text, type = "server") => {
  const div = document.createElement("div");
  div.className = `line line--${type}`;
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
};

const renderMsg = (p) => {
  if (typeof p === "string") return print(p);
  const { type = "message", sender = "server", message: m = "" } = p || {};
  if (!m) return;
  if (["system", "error"].includes(type)) return print(m, type);
  print(
    sender === "chat-bot" ? `chat-bot: ${m}` : `${sender}: ${m}`,
    sender === "chat-bot" ? "server" : "user-peer",
  );
};

const sendMsg = () => {
  const m = input.value.trim();
  if (!m) return;
  if (!socket.connected)
    return print("Unable to send message. Socket not connected.", "error");
  print(`you: ${m}`, "user");
  socket.emit("chat:message", m);
  input.value = "";
};

socket.on("connect", () => {
  print("Connected to server", "system");
  socket.emit("room:join", { roomCode });
});

socket.on("chat:message", renderMsg);
socket.on("room:error", (p) => print(p?.message || "Room error", "error"));
socket.on("disconnect", () => print("Disconnected", "error"));
socket.on("connect_error", () =>
  print("Unable to connect to server.", "error"),
);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMsg();
  }
});
sendBtn.addEventListener("click", sendMsg);
input.focus();
