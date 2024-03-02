// script.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
  
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const { token } = await response.json()
      
      console.log('header', token)
      // const data = await response.json();
      localStorage.setItem('token', token)
      // if(response.status === 401){
      //   alert(data.message)
      // }else if(response.status === 200){
      //   alert(`Welcome ${data.username} Sucessfully LogIn`)
        window.location.href= 'home.html'
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