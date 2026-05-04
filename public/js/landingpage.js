const createRoomBtn = document.getElementById('create_room');
const joinForm = document.getElementById('join_room_form');
const joinInput = document.getElementById('join_room');

async function createRoom() {
  if (!createRoomBtn) return;

  createRoomBtn.disabled = true;
    createRoomBtn.textContent = 'Creating room';

  try {
    const response = await fetch('/room/create-room', {
      method: 'POST'
    });
    const payload = await response.json();
    const code = payload.data.code;
    window.location.assign(`/room/join-room/${code}`);
  } catch (error) {
    console.error('Error creating room:', error);
    createRoomBtn.disabled = false;
    createRoomBtn.textContent = 'Try again';
  }
}

if (createRoomBtn) {
  createRoomBtn.addEventListener('click', createRoom);
}

if (joinInput) {
  joinInput.addEventListener('input', () => {
    joinInput.value = joinInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  });
}

if (joinForm && joinInput) {
  joinForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const roomCode = joinInput.value.trim().toUpperCase();
    if (!roomCode) return;

    window.location.assign(`/room/join-room/${roomCode}`);
  });
}
