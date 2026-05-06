const form = document.getElementById('login_form');
const msg = document.getElementById('login_message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('.submit-button');
  const oldText = btn.textContent;
  
  btn.disabled = true;
  btn.textContent = 'Logging in';
  msg.textContent = '';
  msg.className = 'message';

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email.value, password: form.password.value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error');
    
    // Cookies are automatically set by the backend response
    
    window.location.href = '/userDashboard';
  } catch (err) {
    msg.textContent = err.message;
    msg.classList.add('is-error');
  } finally {
    btn.disabled = false;
    btn.textContent = oldText;
  }
});
