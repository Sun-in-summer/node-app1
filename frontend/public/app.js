document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.getElementById('form-container');

  function renderForm(isLogin) {
    formContainer.innerHTML = `
      <form id="${isLogin ? 'login-form' : 'register-form'}">
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <div id="captcha-container">
          <img id="captcha-image" src="/captcha" alt="Captcha" onclick="reloadCaptcha()">
          <input type="text" id="captcha-input" placeholder="Enter CAPTCHA" required>
        </div>
        <button type="submit">${isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p class="error" id="error-message"></p>
    `;

    if (!isLogin) {
      formContainer.innerHTML +=
        '<button id="toggle-login">Already have an account? Login</button>';
    } else {
      formContainer.innerHTML +=
        '<button id="toggle-register">Don\'t have an account? Register</button>';
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePassword(password) {
    return password.length >= 8;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const captcha = document.getElementById('captcha-input').value;

    if (!validateEmail(email)) {
      showError('Invalid email');
      return;
    }

    if (!validatePassword(password)) {
      showError('Password must be at least 8 characters long');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('captcha', captcha);

    console.log(formData.get('email'));
    console.log(formData.get('password'));

    try {
      const response = await fetch(
        `/auth/${event.target.id === 'login-form' ? 'login' : 'register'}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log(
        `/auth/${event.target.id === 'login-form' ? 'login' : 'register'}`
      );

      const data = await response.json();

      if (data.message) {
        if (response.status === 200) {
          alert(data.message);
        } else {
          showError(data.message);
          reloadCaptcha();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      showError('An error occurred');
    }
  }

  function showError(message) {
    document.getElementById('error-message').textContent = message;
  }

  function reloadCaptcha() {
    const captchaImage = document.getElementById('captcha-image');
    captchaImage.src = '/captcha?' + new Date().getTime();
  }

  document.addEventListener('click', (event) => {
    if (event.target.id === 'toggle-login') {
      renderForm(true);
    } else if (event.target.id === 'toggle-register') {
      renderForm(false);
    }
  });

  document.addEventListener('submit', (event) => {
    if (
      event.target.id === 'login-form' ||
      event.target.id === 'register-form'
    ) {
      handleSubmit(event);
    }
  });

  renderForm(false);
});
