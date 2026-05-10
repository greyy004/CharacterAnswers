const $ = (id) => document.getElementById(id);

const createBtn = $("create_room"),
      joinForm  = $("join_room_form"),
      joinInput = $("join_room");

const msg     = $("dashboard_message"),
      welcome = $("welcome_title"),
      logout  = $("logout_link");

/* ── Greeting ── */
const getCookie = (name) => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const username = getCookie("username");
const hour = new Date().getHours();
const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

welcome.textContent = username
  ? `Good ${timeOfDay}, ${username}.`
  : `Good ${timeOfDay}.`;

/* ── Logout ── */
logout.addEventListener("click", async (e) => {
  e.preventDefault();
  await fetch("/auth/logout", { method: "POST" });
  window.location.href = "/login";
});

/* ── Show message ── */
const showMsg = (text, type = "") => {
  msg.textContent = text;
  msg.className = `form-message ${type ? "is-" + type : ""}`;
};

/* ── Create room ── */
createBtn.addEventListener("click", async () => {
  createBtn.disabled = true;
  createBtn.textContent = "Creating room…";
  try {
    const res  = await fetch("/rooms/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error");
    const code = data.code;
    if (!code) throw new Error("Room code was not returned.");
    window.location.href = `/rooms/join-room/${code}`;
  } catch (err) {
    showMsg(err.message, "error");
    createBtn.disabled = false;
    createBtn.textContent = "Try again";
  }
});

/* ── Join room input ── */
joinInput.addEventListener("input", (e) => {
  e.target.value = e.target.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
  showMsg("");
});

joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = joinInput.value.trim();
  if (!code) return showMsg("Enter a room code first.", "error");
  window.location.assign(`/rooms/join-room/${code}`);
});