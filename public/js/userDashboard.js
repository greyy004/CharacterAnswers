const createRoomBtn = document.getElementById('create_room');
const joinForm = document.getElementById('join_room_form');
const joinInput = document.getElementById('join_room');
const dashboardMessage = document.getElementById('dashboard_message');
const welcomeTitle = document.getElementById('welcome_title');

const savedUser = JSON.parse(localStorage.getItem('characterAnswersUser') || 'null');

if (savedUser?.username) {
  welcomeTitle.textContent = `Welcome back, ${savedUser.username}.`;
}

function setMessage(message, type) {
  dashboardMessage.textContent = message;
  dashboardMessage.classList.toggle('is-error', type === 'error');
}

async function createRoom() {
  createRoomBtn.disabled = true;
  createRoomBtn.textContent = 'Creating room';

  try {
    const response = await fetch('/room/create-room', {
      method: 'POST'
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'Unable to create a room.');
    }

    const code = payload.data.code;
    window.location.assign(`/room/join-room/${code}`);
  } catch (error) {
    setMessage(error.message, 'error');
    createRoomBtn.disabled = false;
    createRoomBtn.textContent = 'Try again';
  }
}

createRoomBtn.addEventListener('click', createRoom);

joinInput.addEventListener('input', () => {
  joinInput.value = joinInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  setMessage('', '');
});

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const roomCode = joinInput.value.trim().toUpperCase();

  if (!roomCode) {
    setMessage('Enter a room code first.', 'error');
    joinInput.focus();
    return;
  }

  window.location.assign(`/room/join-room/${roomCode}`);
});
