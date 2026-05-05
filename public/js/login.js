const loginForm = document.getElementById('login_form');
const loginMessage = document.getElementById('login_message');

function setMessage(message, type) {
  loginMessage.textContent = message;
  loginMessage.classList.toggle('is-error', type === 'error');
  loginMessage.classList.toggle('is-success', type === 'success');
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

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const button = loginForm.querySelector('.submit-button');
  const originalText = button.textContent;
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  button.disabled = true;
  button.textContent = 'Logging in';
  setMessage('', '');

  try {
    const response = await fetch('/auth/login', {
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
    setMessage(data.message || 'Logged in successfully.', 'success');
    loginForm.reset();
    window.location.href = '/userDashboard';
  } catch (error) {
    setMessage(error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});
