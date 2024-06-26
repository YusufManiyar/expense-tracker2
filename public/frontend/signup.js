// script.js
import config from './config.js'

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
  
    try {
      const response = await fetch(`${config.BACKEND_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      }).then(async (res) => {
        const data = await res.json()
        localStorage.setItem("token", data.token)
        if(res.status === 400){
          alert(data.message)
        } else if(res.ok) {
          alert("User Create Successfully")
          window.location.href= 'index.html'
        }
      })
    } catch (error) {
      console.error('Error:', error);
    }
  });
// script.js
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

  document.getElementById("myLink").addEventListener("click", function(event) {
    event.preventDefault(); 
    window.location.href = 'login.html'
  });
  
  
  