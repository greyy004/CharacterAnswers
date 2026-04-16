const createRoomBtn = document.getElementById('create_room');
const joinForm = document.getElementById('join_room_form');
const joinInput = document.getElementById('join_room');

async function createRoom() {
  if (!createRoomBtn) return;

  createRoomBtn.disabled = true;
  createRoomBtn.textContent = 'Creating room';

  try {
    const response = await fetch('/code/create-room', {
      method: 'POST'
    });

    const payload = await response.json();
    const redirectUrl = payload?.data?.redirectUrl;

    if (response.ok && redirectUrl) {
      window.location.assign(redirectUrl);
      return;
    }

    throw new Error('Room creation failed');
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
  joinForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const roomCode = joinInput.value.trim().toUpperCase();
    if (!roomCode) return;

    window.location.assign(`/room/${roomCode}`);
  });
}

