const loginTab = document.getElementById('login_tab');
const registerTab = document.getElementById('register_tab');
const loginForm = document.getElementById('login_form');
const registerForm = document.getElementById('register_form');
const switchButtons = document.querySelectorAll('[data-switch-form]');
const loginMessage = document.getElementById('login_message');
const registerMessage = document.getElementById('register_message');

function setActiveForm(formName) {
  const isRegister = formName === 'register';

  loginTab.classList.toggle('is-active', !isRegister);
  registerTab.classList.toggle('is-active', isRegister);
  loginForm.classList.toggle('is-active', !isRegister);
  registerForm.classList.toggle('is-active', isRegister);

  loginTab.setAttribute('aria-selected', String(!isRegister));
  registerTab.setAttribute('aria-selected', String(isRegister));

  const nextPath = isRegister ? '/register' : '/login';
  if (window.location.pathname !== nextPath) {
    window.history.replaceState(null, '', nextPath);
  }
}

function setMessage(element, message, type) {
  element.textContent = message;
  element.classList.toggle('is-error', type === 'error');
  element.classList.toggle('is-success', type === 'success');
}

async function submitAuthForm({ form, endpoint, messageElement, loadingText, successText }) {
  const button = form.querySelector('.submit-button');
  const originalText = button.textContent;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  button.disabled = true;
  button.textContent = loadingText;
  setMessage(messageElement, '', '');

  try {
    const response = await fetch(endpoint, {
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

    setMessage(messageElement, successText || data.message, 'success');
    form.reset();
  } catch (error) {
    setMessage(messageElement, error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

loginTab.addEventListener('click', () => setActiveForm('login'));
registerTab.addEventListener('click', () => setActiveForm('register'));

switchButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveForm(button.dataset.switchForm);
  });
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  submitAuthForm({
    form: loginForm,
    endpoint: '/auth/login',
    messageElement: loginMessage,
    loadingText: 'Logging in',
    successText: 'Logged in successfully.'
  });
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  submitAuthForm({
    form: registerForm,
    endpoint: '/auth/register',
    messageElement: registerMessage,
    loadingText: 'Creating account',
    successText: 'Account created successfully.'
  });
});

setActiveForm(window.location.pathname.includes('register') ? 'register' : 'login');
