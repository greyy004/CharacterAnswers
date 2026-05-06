const form = document.getElementById('register_form');
const msg = document.getElementById('register_message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('.submit-button');
  const oldText = btn.textContent;
  
  btn.disabled = true;
  btn.textContent = 'Creating account';
  msg.textContent = '';
  msg.className = 'message';

  try {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: form.username.value,
        email: form.email.value, 
        password: form.password.value 
      })
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
