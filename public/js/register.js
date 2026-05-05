const registerForm = document.getElementById('register_form');
const registerMessage = document.getElementById('register_message');

function setMessage(message, type) {
  registerMessage.textContent = message;
  registerMessage.classList.toggle('is-error', type === 'error');
  registerMessage.classList.toggle('is-success', type === 'success');
}

function saveUser(user) {
  try {
    if (user) {
      localStorage.setItem('characterAnswersUser', JSON.stringify(user));
    }
  } catch (error) {
    console.warn('Unable to save user locally:', error);
  }
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const button = registerForm.querySelector('.submit-button');
  const originalText = button.textContent;
  const formData = new FormData(registerForm);
  const payload = Object.fromEntries(formData.entries());

  button.disabled = true;
  button.textContent = 'Creating account';
  setMessage('', '');

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong.');
    }

    saveUser(data.user);
    setMessage(data.message || 'Account created successfully.', 'success');
    registerForm.reset();
    window.location.href = '/userDashboard';
  } catch (error) {
    setMessage(error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});
