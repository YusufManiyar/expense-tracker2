// script.js
import config from './config.js'

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
  
    try {
      const response = await fetch(`${config.BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const { token, ispremiumactive } = await response.json()
      // const data = await response.json();
      localStorage.setItem('token', token )
      localStorage.setItem('premiumActive', ispremiumactive )
      if(response.ok){
        window.location.href= 'index.html'
      }
      // }
    } catch (error) {
       alert(error)
      console.error('Error:', error);
    }
  });
  
  document.getElementById('togglePassword').addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('togglePassword');
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  });