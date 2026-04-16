const generateBtn = document.getElementById('generate_code');
const codeInput = document.getElementById('code');
const joinInput = document.getElementById('join_room');

async function generateCode() {
  if (!generateBtn || !codeInput) return;

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating';

  try {
    const response = await fetch('/code/generate');
    const payload = await response.json();
    const roomCode = payload?.data?.code ?? '';

    codeInput.value = roomCode;

    if (roomCode) {
      codeInput.focus();
      codeInput.select();
    }
  } catch (error) {
    console.error('Error generating code:', error);
    codeInput.value = 'unable to generate code';
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate';
  }
}

if (generateBtn) {
  generateBtn.addEventListener('click', generateCode);
}

if (joinInput) {
  joinInput.addEventListener('input', () => {
    joinInput.value = joinInput.value.toUpperCase();
  });
}
